import { useEffect, useState } from "react"
import { CurrentUser } from "./useCurrentUser"
import { useMockAuth } from "./useMockAuth"
import { useUser } from "./useUser"

interface UserState {
  loading: boolean
  currentUser: CurrentUser | null
}

/**
 * サインインしているユーザーのプロフィール情報をデータベースから取得する。
 */
export function useUserState(): UserState {
  const authState = useAuthState()

  const user = useUser(
    !authState.loading && authState.uid ? authState.uid : null
  )

  if (user) {
    return {
      loading: false,
      currentUser: user,
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
