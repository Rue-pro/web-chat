import { toast } from 'react-toastify'

type Props = any
// [req, res, next]

export const myErrorCatcher: Props =
  (store: Props) => (next: Props) => (action: Props) => {
    if (action?.meta?.requestStatus === 'rejected') {
      toast.error(action?.payload?.data?.error)
    }
    return next(action)
  }
