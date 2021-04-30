import { InsecureAuthInfoEntity, UserEntity } from "../entity-types"
import { ENV_API_ENDPOINT } from "../env"

/**
 * サインイン機能をモックする。
 * Session storage にサインイン状態を記録するので、ブラウザーを開いている間は持続する。
 */
export function useMockAuth(): AuthStateStorage {
  return AuthStateStorage.getInstance()
}

/**
 * サインイン状態を保持するシングルトンなクラス。
 */
class AuthStateStorage {
  /**
   * シングルトンインスタンス。
   */
  private static instance?: AuthStateStorage

  /**
   * シングルトンインスタンスを取得する。
   */
  static getInstance(): AuthStateStorage {
    if (!AuthStateStorage.instance) {
      AuthStateStorage.instance = new AuthStateStorage()
    }

    return AuthStateStorage.instance
  }

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
  private readonly storage = new Storage(
    "firebook.currentUserUID",
    globalThis.sessionStorage
  )

  /**
   * コンストラクター。
   */
  private constructor() {
    if (this.initialized) return

    const uid = this.storage.load()
    if (uid) {
      this.currentUser = { uid }
    }

    this.initialized = true
  }

  /**
   * サインイン状態が変化したら通知を受け取る。
   */
  onAuthStateChanged(listener: AuthStateListener): () => void {
    if (this.initialized) {
      // 追加タイミングによっては通知を逃すかもしれないので、追加直後に一度通知する。
      listener(this.currentUser)
    }

    return this.storage.subscribe(() => {
      listener(this.currentUser)
    })
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

    if (!authInfo) {
      throw new Error("サインインに失敗しました。")
    }

    this.currentUser = authInfo
    this.storage.save(authInfo.uid)
  }

  /**
   * サインアウト（ログアウト）する。
   */
  async signOut(): Promise<void> {
    this.currentUser = null
    this.storage.clear()
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
    const { id: uid }: UserEntity = await fetch(`${ENV_API_ENDPOINT}/users`, {
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

    const authInfo: InsecureAuthInfoEntity = await resp.json()

    this.currentUser = authInfo
    this.storage.save(authInfo.uid)
  }
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
 * 変更を通知するストレージラッパー。
 */
class Storage {
  private readonly listeners: StorageListener[] = []

  constructor(
    private readonly key: string,
    private readonly storage: globalThis.Storage
  ) {}

  load(): string | null {
    return this.storage.getItem(this.key)
  }

  save(value: string): void {
    this.storage.setItem(this.key, value)

    this.notify()
  }

  clear(): void {
    this.storage.removeItem(this.key)

    this.notify()
  }

  subscribe(listener: StorageListener): () => void {
    this.listeners.push(listener)

    const unsubscribe = () => {
      const index = this.listeners.lastIndexOf(listener)
      if (index === -1) return

      this.listeners.splice(index, 1)
    }

    return unsubscribe
  }

  private notify() {
    this.listeners.forEach((listener) => {
      listener()
    })
  }
}

/**
 * 通知を受け取るコールバック。
 */
interface StorageListener {
  (): void
}
