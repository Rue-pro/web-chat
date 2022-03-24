const checkedEnvVariable = (envVariable: string): string => {
  const envVarFullName = process.env[`REACT_APP_${envVariable}`]
  if (!envVarFullName || envVariable === '')
    throw Error(`Variable REACT_APP_${envVariable} should be defined`)
  return envVarFullName
}

export const API_URL = checkedEnvVariable('API_URL')
