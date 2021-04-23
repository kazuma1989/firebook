import { PostEntity } from "../entity-types"
import { ENV_API_ENDPOINT } from "../env"

export async function add(input: Partial<PostEntity>): Promise<PostEntity> {
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

  return await resp.json()
}

export async function update(
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

  return await resp.json()
}

export async function remove(id: string): Promise<void> {
  const resp = await fetch(`${ENV_API_ENDPOINT}/posts/${id}`, {
    method: "DELETE",
  })
  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText} ${await resp.text()}`)
  }
}
