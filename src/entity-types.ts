/**
 * データは必ず ID を持つ。
 */
interface Entity {
  id: string
}

/**
 * 認証情報。
 */
export interface InsecureAuthInfo extends Entity {
  email: string
  insecurePlainPassword: string
  uid: string
}

/**
 * ユーザーのプロフィール。
 */
export interface User extends Entity {
  displayName: string
  photoURL?: string
}

/**
 * 投稿のデータ。
 */
export interface Post extends Entity {
  author: string
  text?: string
  imgSrc?: string
  postedAt: number
  likes: string[]
  totalComments: number
}

/**
 * コメントのデータ。
 */
export interface Comment extends Entity {
  postId: string
  author: string
  text: string
  postedAt: number
}
