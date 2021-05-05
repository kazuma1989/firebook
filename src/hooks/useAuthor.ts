import { useUser } from "./useUser"

interface Author {
  displayName?: string
  photoURL?: string
}

/**
 * 投稿者の情報を取得する。
 */
export function useAuthor(id: string | undefined): Author | null {
  return useUser(id)
}
