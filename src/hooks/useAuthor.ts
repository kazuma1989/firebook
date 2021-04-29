import useSWR from "swr"
import { UserEntity } from "../entity-types"
import { ENV_API_ENDPOINT } from "../env"

interface Author {
  displayName: string
  photoURL?: string
}

/**
 * 投稿者の情報を非同期で取得する。
 */
export function useAuthor(authorId: string | undefined): Author | undefined {
  const user$ = useSWR<UserEntity>(
    authorId ? `/users/${authorId}` : null,

    async (path: string) => {
      const resp = await fetch(`${ENV_API_ENDPOINT}${path}`)
      if (!resp.ok) {
        throw new Error(
          `${resp.status} ${resp.statusText} ${await resp.text()}`
        )
      }

      return await resp.json()
    }
  )
  if (!user$.data) return

  const { displayName, photoURL } = user$.data

  return {
    displayName,
    photoURL: photoURL ?? undefined,
  }
}
