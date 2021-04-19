import { useEffect } from "react"
import { useSWRInfinite } from "swr"
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
  page: number
): Comment[] {
  const { data: pagedComments, size, setSize } = useSWRInfinite<
    CommentEntity[]
  >((pageIndex, previousPageData) => {
    if (!postId) {
      return null
    }
    if (previousPageData?.length === 0) {
      // 最終ページに達した。
      return null
    }

    return `/comments?postId=${postId}&_sort=postedAt&_order=desc&_limit=3&_page=${
      pageIndex + 1
    }`
  })

  useEffect(() => {
    if (page === size) return

    setSize(page)
  }, [page, setSize, size])

  return pagedComments?.flat() ?? []
}
