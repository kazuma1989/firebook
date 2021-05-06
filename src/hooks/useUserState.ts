import { CurrentUser } from "./useCurrentUser"
import { useCurrentUserUID } from "./useCurrentUserUID"
import { useUser } from "./useUser"

interface UserState {
  loading: boolean
  currentUser: CurrentUser | null
}

/**
 * サインインしているユーザーのプロフィール情報をデータベースから取得する。
 */
export function useUserState(): UserState {
  const uid = useCurrentUserUID()
  const user = useUser(uid ?? undefined)

  if (user) {
    return {
      loading: false,
      currentUser: user,
    }
  }

  if (!uid) {
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
