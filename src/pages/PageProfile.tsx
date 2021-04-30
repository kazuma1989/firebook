import { css } from "@emotion/css"
import { PostArea } from "../components/PostArea"
import { PostInput } from "../components/PostInput"
import { ProfileArea } from "../components/ProfileArea"
import { useCurrentUser } from "../hooks/useCurrentUser"

/**
 * プロフィールページ。
 */
export function PageProfile() {
  const { uid } = useCurrentUser()

  return (
    <div>
      <ProfileArea />

      <div
        className={css`
          min-width: 320px;
          max-width: 680px;
          margin: 16px auto;
        `}
      >
        <PostInput
          className={css`
            margin: 16px 0;
          `}
        />

        <PostArea targetUID={uid} />
      </div>
    </div>
  )
}
