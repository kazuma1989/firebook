import { useEffect, useState } from "react"
import useSWR from "swr"
import { User as UserEntity } from "../entity-types"
import { useMockAuth } from "./useMockAuth"
import { User } from "./useUser"

interface UserState {
  loading: boolean
  user: User | null
}

/**
 * サインインしているユーザーのプロフィール情報をデータベースから取得する。
 */
export function useUserState(): UserState {
  const authState = useAuthState()

  const { data, error } = useSWR<UserEntity>(
    !authState.loading && authState.uid ? `/users/${authState.uid}` : null
  )

  if (error) {
    return {
      loading: false,
      user: null,
    }
  }

  if (data) {
    return {
      loading: false,
      user: {
        ...data,
        uid: data.id,
      },
    }
  }

  if (!authState.loading && !authState.uid) {
    return {
      loading: false,
      user: null,
    }
  }

  return {
    loading: true,
    user: null,
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
