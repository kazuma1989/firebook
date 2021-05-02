import { useUser } from "./useUser"

interface Author {
  displayName?: string
  photoURL?: string
}

/**
 * 投稿者の情報を非同期で取得する。
 */
export function useAuthor(authorId: string | undefined): Author | null {
  return useUser(authorId)
}
