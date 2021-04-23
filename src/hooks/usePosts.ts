import useSWR from "swr"
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
 * 投稿を非同期で取得する。
 *
 * targetUID の指定があるときはそのユーザーの投稿だけを、指定がないときは全部の投稿を表示する。
 */
export function usePosts(
  targetUID: string | undefined,
  limit: number
): [
  Post[],
  {
    add(input: Pick<Post, "author" | "text" | "imgSrc">): Promise<void>
    update(
      input: Pick<
        Post,
        "id" | "author" | "text" | "imgSrc" | "likes" | "totalComments"
      >
    ): Promise<void>
    remove(id: string): Promise<void>
  }
] {
  const posts$ = useSWR<PostEntity[]>(
    targetUID ? `/posts?author=${targetUID}` : "/posts"
  )

  return [
    posts$.data?.slice(-limit).reverse() ?? [],

    {
      async add(input) {},

      async update(input) {
        const resp = await fetch(`${ENV_API_ENDPOINT}/posts/${input.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        })
        if (!resp.ok) {
          throw new Error(
            `${resp.status} ${resp.statusText} ${await resp.text()}`
          )
        }

        const updated: PostEntity = await resp.json()
        await posts$.mutate(
          (posts) =>
            posts?.map((post) => {
              if (post.id !== updated.id) {
                return post
              }

              return updated
            }),
          false
        )
      },

      async remove(id) {
        const resp = await fetch(`${ENV_API_ENDPOINT}/posts/${id}`, {
          method: "DELETE",
        })
        if (!resp.ok) {
          throw new Error(
            `${resp.status} ${resp.statusText} ${await resp.text()}`
          )
        }

        await posts$.mutate((posts) => posts?.filter((c) => c.id !== id), false)
      },
    },
  ]
}
