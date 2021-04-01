import { css, cx } from "@emotion/css"
import { useEffect, useState } from "react"

/**
 * リアルタイムに表示を更新しつつ、相対的な時刻を表示する。
 */
export function RelativeTime({
  value,
  className,
  style,
}: {
  value?: Date
  className?: string
  style?: React.CSSProperties
}) {
  const [text, setText] = useState(value ? relativeExpressionOf(value) : "")

  // タイマーを設定する。
  useEffect(() => {
    if (!value) return

    let interval = 60_000
    if (value.getTime() - Date.now() >= 86400_000) {
      interval = 3600_000
    }

    setText(relativeExpressionOf(value))

    const timer = setInterval(() => {
      setText(relativeExpressionOf(value))
    }, interval)

    return () => {
      clearInterval(timer)
    }
  }, [value])

  return (
    <time
      title={value?.toLocaleString()}
      dateTime={value?.toISOString()}
      className={cx(
        css`
          color: var(--color-light-40);
          font-size: 12px;
        `,
        className
      )}
      style={style}
    >
      {text}
    </time>
  )
}

/**
 * 時刻を相対的な文字列表現にする。
 *
 * 計算は大体でいいので、月は 30 日間固定、年は 365 日間固定で計算する。
 *
 * @param date 相対表示したい時刻。
 * @param from 基準となる時刻。省略すると、関数を呼び出した時刻が基準となる。
 */
function relativeExpressionOf(date: Date, from = new Date()): string {
  const delta = from.getTime() - date.getTime()

  if (delta < 60_000) {
    return "今"
  } else if (delta < 3600_000) {
    const minutes = (delta - (delta % 60_000)) / 60_000

    return `${minutes}分前`
  } else if (delta < 86400_000) {
    const hours = (delta - (delta % 3600_000)) / 3600_000

    return `${hours}時間前`
  } else if (delta < 86400_000 * 30) {
    const days = (delta - (delta % 86400_000)) / 86400_000

    return `${days}日前`
  } else if (delta < 86400_000 * 365) {
    const months = (delta - (delta % (86400_000 * 30))) / (86400_000 * 30)

    return `${months}か月前`
  } else {
    const years = (delta - (delta % (86400_000 * 365))) / (86400_000 * 365)

    return `${years}年前`
  }
}
