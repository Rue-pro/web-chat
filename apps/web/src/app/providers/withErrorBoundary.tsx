import { Component, ErrorInfo } from 'react'
import { Alert } from '@mui/material'

interface Props {
  children: Component
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return <Alert severity="error">Sorry.. something went wrong</Alert>
    }

    return <>{this.props.children}</>
  }
}

const withErrorBoundary = (component: () => Component) => () => {
  return <ErrorBoundary>{component()}</ErrorBoundary>
}

export default withErrorBoundary
