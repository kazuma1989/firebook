import { mutate } from "swr"
import { UserEntity } from "../entity-types"
import { ENV_API_ENDPOINT } from "../env"

/**
 * プロフィールを更新する。
 */
export async function updateProfile(
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

  await mutate(`/users/${id}`)

  return await resp.json()
}
