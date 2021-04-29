/**
 * データは必ず ID を持つ。
 */
interface Entity {
  id: string
}

/**
 * 認証情報。
 */
export interface InsecureAuthInfoEntity extends Entity {
  email: string
  insecurePlainPassword: string
  uid: string
}

/**
 * ユーザーのプロフィール。
 */
export interface UserEntity extends Entity {
  displayName: string
  photoURL: string | null
}

/**
 * 投稿のデータ。
 */
export interface PostEntity extends Entity {
  author: string
  text: string | null
  imgSrc: string | null
  postedAt: number
  likes: string[]
  totalComments: number
}

/**
 * コメントのデータ。
 */
export interface CommentEntity extends Entity {
  postId: string
  author: string
  text: string
  postedAt: number
}
