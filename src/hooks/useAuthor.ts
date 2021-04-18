import { useEffect, useState } from "react"
import { User } from "../entity-types"
import { ENV_API_ENDPOINT } from "../env"

interface Author {
  displayName: string
  photoURL?: string
}

/**
 * 投稿者の情報を非同期で取得する。
 */
export function useAuthor(authorId: string | undefined): Author | null {
  const [author, setAuthor] = useState<Author | null>(null)

  useEffect(() => {
    ;(async () => {
      if (!authorId) return

      const resp = await fetch(`${ENV_API_ENDPOINT}/users/${authorId}`)
      if (!resp.ok) return

      const user: User = await resp.json()
      setAuthor(user)
    })()
  }, [authorId])

  return author
}
