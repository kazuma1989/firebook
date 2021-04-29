import { css, cx } from "@emotion/css"

/**
 * アバター（プロフィールアイコン）。
 */
export function Avatar({
  src,
  alt,
  className,
  style,
}: {
  src?: string
  alt?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      className={cx(
        css`
          display: inline-block;
          width: 40px;
          height: 40px;
          overflow: hidden;
          background-color: var(--color-light-100);
          border-radius: 50%;
        `,
        className
      )}
      style={style}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={css`
            width: 100%;
            height: 100%;
            border: solid 1px var(--color-light-90);
            border-radius: 50%;
            object-fit: cover;
          `}
        />
      ) : (
        <DefaultAvatar
          className={css`
            width: 100%;
            height: 100%;
            color: var(--color-light-40);
            border: solid 1px var(--color-light-90);
            border-radius: 50%;
          `}
        />
      )}
    </span>
  )
}

/**
 * デフォルトアバター。
 */
function DefaultAvatar({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      className={cx(
        css`
          display: block;
          width: 1em;
        `,
        className
      )}
      style={style}
      viewBox="2 2 20 20"
    >
      <path
        fill="currentColor"
        d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"
      />
    </svg>
  )
}
