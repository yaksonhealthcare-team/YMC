import React, { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "./Button"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">죄송합니다</h1>
          <p className="text-gray-600 mb-6">예상치 못한 오류가 발생했습니다.</p>
          <Button onClick={this.handleReload}>페이지 새로고침</Button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
