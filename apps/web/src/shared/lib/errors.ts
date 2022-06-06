import { ClientError, ErrorTypes } from 'shared/config'

export const generateWrongFetchedFormatError = ({
  query,
  entity,
  res,
  expectedType,
}: {
  query: string
  entity: string
  res: any
  expectedType: any
}): ClientError => {
  return {
    type: ErrorTypes.ERROR_BACKEND_RESPONSE_VALIDATION,
    date: new Date(),
    message: `[${query}] Fetched ${entity} data format is wrong:
      ${JSON.stringify(res)}`,
    details: `Expected: ${expectedType.toString()}`,
  }
}
