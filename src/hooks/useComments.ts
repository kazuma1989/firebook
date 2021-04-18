import useSWR from "swr"
import { Comment as CommentEntity } from "../entity-types"

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
  const { data: comments } = useSWR<CommentEntity[]>(
    postId ? `/comments?postId=${postId}` : null
  )

  return comments?.slice(-limit) ?? []
}
