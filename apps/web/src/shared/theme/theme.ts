import { createTheme, ThemeOptions } from '@mui/material'
import { colors } from './colors'

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    background: {
      default: colors.gray[6],
      paper: colors.gray[2],
    },
  },
  typography: {
    h1: {
      fontSize: '1.4rem',
    },
    h2: {
      fontSize: '1.35rem',
    },
    h3: {
      fontSize: '1.3rem',
    },
    h4: {
      fontSize: '1.25rem',
    },
    h5: {
      fontSize: '1.2rem',
    },
    h6: {
      fontSize: '1.15rem',
    },
    button: {
      fontWeight: 800,
    },
  },
}

export const theme = createTheme(themeOptions)
