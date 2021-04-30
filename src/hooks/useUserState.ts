import { useEffect, useState } from "react"
import useSWR from "swr"
import { UserEntity } from "../entity-types"
import { ENV_API_ENDPOINT } from "../env"
import { CurrentUser } from "./useCurrentUser"
import { useMockAuth } from "./useMockAuth"

interface UserState {
  loading: boolean
  currentUser: CurrentUser | null
}

/**
 * サインインしているユーザーのプロフィール情報をデータベースから取得する。
 */
export function useUserState(): UserState {
  const authState = useAuthState()

  const user$ = useSWR<UserEntity>(
    !authState.loading && authState.uid ? `/users/${authState.uid}` : null,

    async (path: string) => {
      const resp = await fetch(`${ENV_API_ENDPOINT}${path}`)
      if (!resp.ok) {
        throw new Error(
          `${resp.status} ${resp.statusText} ${await resp.text()}`
        )
      }

      return await resp.json()
    }
  )

  if (user$.error) {
    return {
      loading: false,
      currentUser: null,
    }
  }

  if (user$.data) {
    const { id, displayName, photoURL } = user$.data

    return {
      loading: false,
      currentUser: {
        uid: id,
        displayName,
        photoURL: photoURL ?? undefined,
      },
    }
  }

  if (!authState.loading && !authState.uid) {
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
 * サインイン状態を取得する。
 */
function useAuthState(): AuthState {
  const auth = useMockAuth()

  const [authState, setAuthState] = useState<AuthState>(
    // currentUser が初期化済みであれば、その値を初期値として使い、loading = false とする。
    // currentUser が null のときは、サインアウト状態か初期化待ちかわからないので、loading = true とし、onAuthStateChanged を待つ。
    auth.currentUser
      ? {
          loading: false,
          uid: auth.currentUser.uid,
        }
      : {
          loading: true,
        }
  )

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setAuthState({
        loading: false,
        uid: currentUser?.uid,
      })
    })

    return unsubscribe
  }, [auth])

  return authState
}

type AuthState =
  | {
      loading: true
    }
  | {
      loading: false
      uid?: string
    }
