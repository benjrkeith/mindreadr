import { createTheme } from '@mui/material'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#149381',
    },
    secondary: {
      main: '#a31c31',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 640,
      lg: 1280,
      xl: 1600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
      },
    },
  },
})
