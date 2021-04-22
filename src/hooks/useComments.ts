import useSWR from "swr"
import { CommentEntity, PostEntity } from "../entity-types"
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
): [
  Comment[],
  {
    add(input: Pick<Comment, "author" | "text">): Promise<void>
    remove(id: string): Promise<void>
  }
] {
  const post$ = useSWR<PostEntity>(`/posts/${postId}`)
  const comments$ = useSWR<CommentEntity[]>(`/comments?postId=${postId}`)

  return [
    comments$.data?.slice(-limit).reverse() ?? [],

    {
      async add(input) {
        const comment: Partial<CommentEntity> = {
          ...input,
          postId,
          postedAt: Date.now(),
        }

        const resp = await fetch(`${ENV_API_ENDPOINT}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(comment),
        })
        if (!resp.ok) {
          throw new Error(
            `${resp.status} ${resp.statusText} ${await resp.text()}`
          )
        }

        const created: CommentEntity = await resp.json()
        const comments = await comments$.mutate(
          (comments) => [...(comments ?? []), created],
          false
        )

        if (!comments) return

        const patch: Partial<PostEntity> = {
          totalComments: comments.length,
        }
        const resp2 = await fetch(`${ENV_API_ENDPOINT}/posts/${postId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patch),
        })
        if (!resp2.ok) {
          throw new Error()
        }

        post$.mutate(
          (post) => ({
            ...post!,
            ...patch,
          }),
          false
        )
      },

      async remove(id) {
        const resp = await fetch(`${ENV_API_ENDPOINT}/comments/${id}`, {
          method: "DELETE",
        })
        if (!resp.ok) {
          throw new Error(
            `${resp.status} ${resp.statusText} ${await resp.text()}`
          )
        }

        const comments = await comments$.mutate(
          (comments) => comments?.filter((c) => c.id !== id),
          false
        )
        if (!comments) return

        const patch: Partial<PostEntity> = {
          totalComments: comments.length,
        }
        const resp2 = await fetch(`${ENV_API_ENDPOINT}/posts/${postId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patch),
        })
        if (!resp2.ok) {
          throw new Error()
        }

        post$.mutate(
          (post) => ({
            ...post!,
            ...patch,
          }),
          false
        )
      },
    },
  ]
}
