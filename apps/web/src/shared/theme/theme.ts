import { createTheme, ThemeOptions } from '@mui/material'

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#f51d46',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#26252b',
      paper: '#2a292f',
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
