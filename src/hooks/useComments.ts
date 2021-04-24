import useSWR, { mutate } from "swr"
import { CommentEntity } from "../entity-types"
import { ENV_API_ENDPOINT } from "../env"

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

/**
 * コメントを追加する。
 */
export async function addComment(
  input: Omit<CommentEntity, "id">
): Promise<CommentEntity> {
  const resp = await fetch(`${ENV_API_ENDPOINT}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })
  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText} ${await resp.text()}`)
  }

  await Promise.all([
    mutate("/posts"),
    mutate(`/comments?postId=${input.postId}`),
  ])

  return await resp.json()
}

/**
 * コメントを削除する。
 */
export async function removeComment(id: string, postId: string): Promise<void> {
  const resp = await fetch(`${ENV_API_ENDPOINT}/comments/${id}`, {
    method: "DELETE",
  })
  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText} ${await resp.text()}`)
  }

  await Promise.all([mutate("/posts"), mutate(`/comments?postId=${postId}`)])
}
