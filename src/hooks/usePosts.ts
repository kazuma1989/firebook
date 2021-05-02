import useSWR, { mutate } from "swr"
import { PostEntity } from "../entity-types"
import { ENV_API_ENDPOINT } from "../env"

interface Post {
  id: string
  author?: string
  text?: string
  imgSrc?: string
  postedAt?: number
  likes?: string[]
  totalComments?: number
}

/**
 * 投稿を取得する。
 *
 * targetUID の指定があるときはそのユーザーの投稿だけを、指定がないときは全部の投稿を表示する。
 */
export function usePosts(targetUID: string | undefined, limit: number): Post[] {
  const posts$ = useSWR<PostEntity[]>(`${ENV_API_ENDPOINT}/posts`)

  const posts = (targetUID
    ? posts$.data?.filter((p) => p.author === targetUID)
    : posts$.data
  )
    ?.slice(-limit)
    .map(
      ({ id, author, text, imgSrc, postedAt, likes, totalComments }): Post => ({
        id,
        author,
        text: text ?? undefined,
        imgSrc: imgSrc ?? undefined,
        postedAt,
        likes,
        totalComments,
      })
    )
    .reverse()

  return posts ?? []
}

/**
 * 投稿を追加する。
 */
export async function addPost(
  input: Omit<PostEntity, "id">
): Promise<PostEntity> {
  const resp = await fetch(`${ENV_API_ENDPOINT}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })
  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText} ${await resp.text()}`)
  }

  await mutate(`${ENV_API_ENDPOINT}/posts`)

  return await resp.json()
}

/**
 * 投稿を更新する。
 */
export async function updatePost(
  id: string,
  input: Partial<PostEntity>
): Promise<PostEntity> {
  const resp = await fetch(`${ENV_API_ENDPOINT}/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })
  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText} ${await resp.text()}`)
  }

  await mutate(`${ENV_API_ENDPOINT}/posts`)

  return await resp.json()
}

/**
 * 投稿を削除する。
 */
export async function removePost(id: string): Promise<void> {
  const resp = await fetch(`${ENV_API_ENDPOINT}/posts/${id}`, {
    method: "DELETE",
  })
  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText} ${await resp.text()}`)
  }

  await mutate(`${ENV_API_ENDPOINT}/posts`)
}
