import useSWR, { mutate } from "swr"
import { InsecureAuthInfoEntity, UserEntity } from "../entity-types"
import { ENV_API_ENDPOINT } from "../env"
import { CurrentUser } from "./useCurrentUser"
import { useUser } from "./useUser"

interface UserState {
  loading: boolean
  currentUser: CurrentUser | null
}

const storageKey = "firebook.currentUserUID"

/**
 * サインインしているユーザーのプロフィール情報をデータベースから取得する。
 */
export function useUserState(): UserState {
  const uid$ = useSWR(storageKey, (key) => sessionStorage.getItem(key))
  const user = useUser(uid$.data ?? undefined)

  if (user) {
    return {
      loading: false,
      currentUser: user,
    }
  }

  if (!uid$.data) {
    return {
      loading: false,
      currentUser: null,
    }
  }

  return {
    loading: true,
    currentUser: null,
  }
}

/**
 * サインイン（ログイン）する。
 *
 * モック API のレスポンスがあればサインイン成功とするだけの簡易な仕組み。
 * 実際に認証するわけではない。
 */
export async function signIn(email: string, password: string): Promise<void> {
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

  sessionStorage.setItem(storageKey, authInfo.uid)
  mutate(storageKey)
}

/**
 * サインアウト（ログアウト）する。
 */
export async function signOut(): Promise<void> {
  sessionStorage.removeItem(storageKey)
  mutate(storageKey)
}

/**
 * サインアップ（ユーザー登録）する。
 *
 * モックデータベースに users レコードを作成し、その ID に対応した認証レコードを作成する簡易な仕組み。
 * 実際に認証するわけではない。
 */
export async function signUp(
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

  sessionStorage.setItem(storageKey, authInfo.uid)
  mutate(storageKey)
}
