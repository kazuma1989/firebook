import { useEffect } from "react"
import { InsecureAuthInfo, User } from "../entity-types"
import { ENV_API_ENDPOINT } from "../env"

/**
 * サインイン機能をモックする。
 * Session storage にサインイン状態を記録するので、ブラウザーを開いている間は持続する。
 *
 * カスタムイベントによって session storage の変更を検知している。
 */
export function useMockAuth() {
  useEffect(() => {
    globalAuthStateStorage.init()
  }, [])

  return globalAuthStateStorage
}

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
 * サインイン状態をモックするための、session storage のラッパー。
 * カスタムイベントを発行して変更を検知できるようになっている。
 */
class AuthStateStorage {
  /**
   * サインイン中のユーザーの情報。
   */
  currentUser: CurrentUser | null = null

  /**
   * インスタンスを初期化する。
   */
  init(): void {
    this.currentUser = this.load()
  }

  /**
   * サインイン状態が変化したら通知を受け取る。
   */
  onAuthStateChanged(listener: AuthStateListener): () => void {
    // 追加タイミングによっては通知を逃すかもしれないので、追加直後に一度通知する。
    listener(this.currentUser)

    this.listeners.push(listener)

    const unsubscribe = () => {
      const index = this.listeners.lastIndexOf(listener)
      if (index === -1) return

      this.listeners.splice(index, 1)
    }

    return unsubscribe
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

    const [authInfo]: InsecureAuthInfo[] = await fetch(
      `${ENV_API_ENDPOINT}/insecureAuthInfo?${search.toString()}`
    ).then((r) => r.json())

    if (!authInfo) {
      throw new Error("サインインに失敗しました。")
    }

    this.save({
      uid: authInfo.uid,
    })
  }

  /**
   * サインアウト（ログアウト）する。
   */
  async signOut(): Promise<void> {
    this.clear()
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
    const { id: uid }: User = await fetch(`${ENV_API_ENDPOINT}/users`, {
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
        uid,
      }),
    })

    if (!resp.ok) {
      throw new Error("サインアップに失敗しました。")
    }

    const authInfo: InsecureAuthInfo = await resp.json()
    this.save({
      uid: authInfo.uid,
    })
  }

  // #region private

  private static readonly STORAGE_KEY = "firebook.authState"

  private readonly listeners: AuthStateListener[] = []

  private notify(): void {
    this.listeners.forEach((listener) => {
      listener(this.currentUser)
    })
  }

  private load(): CurrentUser | null {
    try {
      return JSON.parse(
        sessionStorage.getItem(AuthStateStorage.STORAGE_KEY) ?? "null"
      )
    } catch (error: unknown) {
      return this.currentUser
    }
  }

  private save(currentUser: CurrentUser): void {
    this.currentUser = currentUser

    sessionStorage.setItem(
      AuthStateStorage.STORAGE_KEY,
      JSON.stringify(this.currentUser)
    )

    this.notify()
  }

  private clear(): void {
    this.currentUser = null

    sessionStorage.removeItem(AuthStateStorage.STORAGE_KEY)

    this.notify()
  }

  // #endregion private
}

const globalAuthStateStorage = new AuthStateStorage()
