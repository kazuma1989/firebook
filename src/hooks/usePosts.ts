import useSWR from "swr"
import { PostEntity } from "../entity-types"

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
export function usePosts(targetUID: string | undefined, limit: number): Post[] {
  const posts$ = useSWR<PostEntity[]>(
    targetUID ? `/posts?author=${targetUID}` : "/posts"
  )

  return posts$.data?.slice(-limit).reverse() ?? []
}
