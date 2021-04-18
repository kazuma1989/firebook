import useSWR from "swr"
import { User } from "../entity-types"

interface Author {
  displayName: string
  photoURL?: string
}

/**
 * 投稿者の情報を非同期で取得する。
 */
export function useAuthor(authorId: string | undefined): Author | undefined {
  const { data: user } = useSWR<User>(authorId ? `/users/${authorId}` : null)

  return user
}
