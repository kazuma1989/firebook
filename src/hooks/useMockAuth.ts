import { createContext, useContext } from "react"
import { InsecureAuthInfoEntity, UserEntity } from "../entity-types"
import { ENV_API_ENDPOINT } from "../env"

/**
 * サインイン機能をモックする。
 * Session storage にサインイン状態を記録するので、ブラウザーを開いている間は持続する。
 */
export function useMockAuth(): MockAuth {
  const mockAuth = useContext(MockAuthContext)
  if (!mockAuth) {
    throw new Error("MockAuthProvider で囲んでいないか value が null です")
  }

  return mockAuth
}

const MockAuthContext = createContext<MockAuth | null>(null)

export const MockAuthProvider = MockAuthContext.Provider

/**
 * サインイン中のユーザーの情報。
 */
interface CurrentUser {
  uid: string
}

/**
 * サインイン状態が変化したら通知を受け取るコールバック。
 */
interface AuthStateListener {
  (currentUser: CurrentUser | null): void
}

/**
 * サインイン状態を保持するクラス。
 */
export class MockAuth {
  /**
   * サインイン中のユーザーの情報。
   */
  currentUser: CurrentUser | null = null

  /**
   * 初期化済みか否か。
   */
  private initialized = false

  /**
   * ストレージ。
   */
  private readonly storage = globalThis.sessionStorage
  private readonly storageKey = "firebook.currentUserUID"

  /**
   * 通知用インスタンス。
   */
  private readonly eventTarget = new EventTarget()
  private readonly eventName = "firebook.currentUserUID"

  /**
   * コンストラクター。
   */
  constructor() {
    const uid = this.storage.getItem(this.storageKey)
    if (uid) {
      this.currentUser = { uid }
      this.storage.setItem(this.storageKey, uid)
    } else {
      this.currentUser = null
    }

    this.initialized = true
    this.eventTarget.dispatchEvent(new Event(this.eventName))
  }

  /**
   * サインイン状態が変化したら通知を受け取る。
   */
  onAuthStateChanged(listener: AuthStateListener): () => void {
    const _listener = () => {
      listener(this.currentUser)
    }

    if (this.initialized) {
      // 追加直後にも一度通知する。
      _listener()
    }

    this.eventTarget.addEventListener(this.eventName, _listener)
    return () => {
      this.eventTarget.removeEventListener(this.eventName, _listener)
    }
  }

  /**
   * サインイン（ログイン）する。
   *
   * モック API のレスポンスがあればサインイン成功とするだけの簡易な仕組み。
   * 実際に認証するわけではない。
   */
  async signIn(email: string, password: string): Promise<void> {
    const search = new URLSearchParams({
      email,
      insecurePlainPassword: password,
    })

    const [authInfo]: InsecureAuthInfoEntity[] = await fetch(
      `${ENV_API_ENDPOINT}/insecureAuthInfo?${search.toString()}`
    ).then((r) => r.json())

    if (!authInfo?.uid) {
      throw new Error("サインインに失敗しました。")
    }

    const { uid } = authInfo
    this.currentUser = { uid }
    this.storage.setItem(this.storageKey, uid)
    this.eventTarget.dispatchEvent(new Event(this.eventName))
  }

  /**
   * サインアウト（ログアウト）する。
   */
  async signOut(): Promise<void> {
    this.currentUser = null
    this.storage.removeItem(this.storageKey)
    this.eventTarget.dispatchEvent(new Event(this.eventName))
  }

  /**
   * サインアップ（ユーザー登録）する。
   *
   * モックデータベースに users レコードを作成し、その ID に対応した認証レコードを作成する簡易な仕組み。
   * 実際に認証するわけではない。
   */
  async signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<void> {
    const { id }: UserEntity = await fetch(`${ENV_API_ENDPOINT}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        displayName,
      }),
    }).then((r) => r.json())

    const resp = await fetch(`${ENV_API_ENDPOINT}/insecureAuthInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        insecurePlainPassword: password,
        uid: id,
      }),
    })
    if (!resp.ok) {
      throw new Error("サインアップに失敗しました。")
    }

    const authInfo: InsecureAuthInfoEntity = await resp.json()
    if (!authInfo.uid) {
      throw new Error("サインアップに失敗しました。")
    }

    const { uid } = authInfo
    this.currentUser = { uid }
    this.storage.setItem(this.storageKey, uid)
    this.eventTarget.dispatchEvent(new Event(this.eventName))
  }
}
