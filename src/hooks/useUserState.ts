import { useEffect, useState } from "react"
import { User as UserEntity } from "../entity-types"
import { ENV_API_ENDPOINT } from "../env"
import { useMockAuth } from "./useMockAuth"
import { User } from "./useUser"

interface UserState {
  user: User | null
  loading: boolean
}

/**
 * サインインしているユーザーのプロフィール情報をデータベースから取得する。
 */
export function useUserState(): UserState {
  const { uid, loading: uidLoading } = useUID()

  const [userState, setUserState] = useState<UserState>({
    user: null,
    loading: true,
  })

  useEffect(() => {
    if (!uid) return

    // サインインできたらデータベースからプロフィールを取得する。
    // エンティティが存在しない可能性もあるが、その場合も loading = false にして取得完了とみなす。
    fetch(`${ENV_API_ENDPOINT}/users/${uid}`)
      .then((r) => r.json())
      .then((user: UserEntity) => {
        setUserState({
          user: {
            ...user,
            uid: user.id,
          },
          loading: false,
        })
      })
  }, [uid])

  useEffect(() => {
    if (uidLoading) return

    // サインアウトしたらプロフィール情報もクリアしておく。
    if (!uid) {
      setUserState({
        user: null,
        loading: false,
      })
    }
  }, [uid, uidLoading])

  return userState
}

/**
 * サインイン状態を取得する。
 */
function useUID(): UIDState {
  const auth = useMockAuth()

  const [uidState, setUIDState] = useState<UIDState>(
    // currentUser が初期化済みであれば、その値を初期値として使い、loading = false とする。
    // currentUser が null のときは、サインアウト状態か初期化待ちかわからないので、loading = true とし、onAuthStateChanged を待つ。
    auth.currentUser
      ? {
          uid: auth.currentUser.uid,
          loading: false,
        }
      : {
          loading: true,
        }
  )

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUIDState({
        uid: currentUser?.uid,
        loading: false,
      })
    })

    return unsubscribe
  }, [auth])

  return uidState
}

interface UIDState {
  uid?: string
  loading: boolean
}
