import useSWR, { mutate } from "swr"
import { UserEntity } from "../entity-types"
import { ENV_API_ENDPOINT } from "../env"

interface User {
  uid: string
  displayName?: string
  photoURL?: string
}

/**
 * ユーザー情報を取得する。
 */
export function useUser(id: string | undefined): User | null {
  const user$ = useSWR<UserEntity>(
    id ? `${ENV_API_ENDPOINT}/users/${id}` : null
  )
  if (!user$.data) {
    return null
  }

  const { id: uid, displayName, photoURL } = user$.data
  return {
    uid,
    displayName,
    photoURL: photoURL ?? undefined,
  }
}

/**
 * ユーザー情報を更新する。
 */
export async function updateUser(
  id: string,
  input: Partial<UserEntity>
): Promise<UserEntity> {
  const resp = await fetch(`${ENV_API_ENDPOINT}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })
  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText} ${await resp.text()}`)
  }

  await mutate(`${ENV_API_ENDPOINT}/users/${id}`)

  return await resp.json()
}
