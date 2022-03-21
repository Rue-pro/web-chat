import compose from 'compose-function'
import { withErrorBoundary } from './withErrorBoundary'
import { withToasts } from './withToasts'

export const withProviders = compose(withErrorBoundary, withToasts)
