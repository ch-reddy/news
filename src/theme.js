import { createTheme } from '@mui/material/styles'

export function getTheme (mode) {
  return createTheme({
    palette: {
      mode: mode || 'light'
    }
  })
}

export default getTheme
