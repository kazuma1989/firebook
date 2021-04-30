import { createContext, useContext } from "react"

/**
 * サインインしているユーザーのプロフィール。
 */
export interface CurrentUser {
  uid: string
  displayName?: string
  photoURL?: string
}

/**
 * サインインしているユーザーのプロフィールを取得する。
 *
 * CurrentUserProvider の配下で使う必要がある。
 */
export function useCurrentUser(): CurrentUser {
  const currentUser = useContext(CurrentUserContext)
  if (!currentUser) {
    throw new Error("CurrentUserProvider で囲んでいないか value が null です")
  }

  return currentUser
}

const CurrentUserContext = createContext<CurrentUser | null>(null)

/**
 * サインインしているユーザーのプロフィールを提供する。
 */
export const CurrentUserProvider = CurrentUserContext.Provider
