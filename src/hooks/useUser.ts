import { createContext, useContext } from "react"

/**
 * サインインしているユーザーのプロフィール。
 */
export interface User {
  uid: string
  displayName?: string
  photoURL?: string
}

/**
 * サインインしているユーザーのプロフィールを取得する。
 *
 * UserProvider の配下で使う必要がある。
 */
export function useUser(): User {
  const user = useContext(UserContext)
  if (!user) {
    throw new Error("UserProvider で囲んでいないか value が null です")
  }

  return user
}

const UserContext = createContext<User | null>(null)

/**
 * サインインしているユーザーのプロフィールを提供する。
 */
export const UserProvider = UserContext.Provider
