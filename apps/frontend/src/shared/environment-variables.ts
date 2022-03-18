const checkedEnvVariable = (envVariable: string): string => {
  const envVarFullName = process.env[`REACT_APP_${envVariable}`]
  if (!envVarFullName || envVariable === '')
    throw Error(`Variable REACT_APP_${envVariable} should be defined`)
  return envVarFullName
}

export const MARVEL_API = checkedEnvVariable('MARVEL_API')
export const API = checkedEnvVariable('MARVEL_API')
