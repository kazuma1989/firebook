import { css, cx } from "@emotion/css"
import { Button } from "./Button"

/**
 * 円形のボタン。
 */
export function ButtonCircle({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cx(
        css`
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          font-size: 20px;
          border-radius: 50%;
        `,
        className
      )}
      {...props}
    />
  )
}
