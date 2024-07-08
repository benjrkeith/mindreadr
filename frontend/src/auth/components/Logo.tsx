import { Box, useTheme } from '@mui/material'

import dark_logo from 'src/assets/dark-logo.svg'
import light_logo from 'src/assets/light-logo.svg'

export function Logo() {
  const { palette } = useTheme()
  const logo = palette.mode === 'dark' ? dark_logo : light_logo

  return (
    <Box
      component='img'
      src={logo}
      sx={{
        height: { xs: 128, sm: 196, md: 256 },
        mx: 'auto',
        mt: { xs: 4, sm: 8, md: 12 },
        mb: 1,
      }}
    />
  )
}
