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
 * 投稿に対するコメントを取得する。
 */
export function useComments(
  postId: string | undefined,
  limit: number
): Comment[] {
  const comments$ = useSWR<CommentEntity[]>(`${ENV_API_ENDPOINT}/comments`)

  const comments = (postId
    ? comments$.data?.filter((c) => c.postId === postId)
    : comments$.data
  )
    ?.slice(-limit)
    .reverse()

  return comments ?? []
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
    mutate(`${ENV_API_ENDPOINT}/posts`),
    mutate(`${ENV_API_ENDPOINT}/comments`),
  ])

  return await resp.json()
}

/**
 * コメントを削除する。
 */
export async function removeComment(id: string): Promise<void> {
  const resp = await fetch(`${ENV_API_ENDPOINT}/comments/${id}`, {
    method: "DELETE",
  })
  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText} ${await resp.text()}`)
  }

  await Promise.all([
    mutate(`${ENV_API_ENDPOINT}/posts`),
    mutate(`${ENV_API_ENDPOINT}/comments`),
  ])
}
