import React from "react"
import { PageOops } from "../pages/PageOops"

interface Props {}

interface State {
  error?: Error
}

/**
 * エラーを捕えられなかったときに Oops ページを表示する。
 */
export class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: unknown): State {
    if (error instanceof Error) {
      return { error }
    }

    return { error: new Error(`Uncaught ${error}`) }
  }

  constructor(props: Props) {
    super(props)

    this.state = {}
  }

  render() {
    const { error } = this.state
    const { children } = this.props

    if (error) {
      return <PageOops details={error.message} />
    }

    return children
  }
}
