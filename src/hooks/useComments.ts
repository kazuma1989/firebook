import useSWR from "swr"
import { CommentEntity } from "../entity-types"

interface Comment {
  id: string
  author?: string
  text?: string
  postedAt?: number
}

/**
 * 投稿に対するコメントを非同期で取得する。
 */
export function useComments(
  postId: string | undefined,
  limit: number
): Comment[] {
  const comments$ = useSWR<CommentEntity[]>(`/comments?postId=${postId}`)

  return comments$.data?.slice(-limit).reverse() ?? []
}
