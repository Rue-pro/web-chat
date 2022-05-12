import compose from 'compose-function'
import withRouter from './withRouter'
import withErrorBoundary from './withErrorBoundary'
import withToasts from './withToasts'

export const withProviders = compose(withErrorBoundary, withRouter, withToasts)
