import { useEffect, useState } from "react"
import { User as UserEntity } from "../entity-types"
import { ENV_API_ENDPOINT } from "../env"
import { useMockAuth } from "./useMockAuth"
import { User } from "./useUser"

/**
 * サインインしているユーザーのプロフィール情報をデータベースから取得する。
 */
export function useUserState() {
  const { currentUser } = useMockAuth()

  const [userState, setUserState] = useState<User | null>(null)

  const uid = currentUser?.uid
  useEffect(() => {
    if (!uid) return

    // サインインできたらデータベースからプロフィールを取得する。
    fetch(`${ENV_API_ENDPOINT}/users/${uid}`)
      .then((r) => r.json())
      .then((user: UserEntity) => {
        setUserState({
          ...user,
          uid: user.id,
        })
      })
  }, [uid])

  useEffect(() => {
    // サインアウトしたらプロフィール情報もクリアしておく。
    if (!currentUser) {
      setUserState(null)
    }
  }, [currentUser])

  return userState
}
