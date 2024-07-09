import { Box, Container, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { LogInForm } from 'src/auth/components/LogInForm'
import { Logo } from 'src/auth/components/Logo'

export function LogIn() {
  return (
    <Container
      maxWidth='md'
      sx={{
        my: 'auto',
        height: '100%',
        maxHeight: { xs: 568, sm: 854, md: 1138 },
        minWidth: 320,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Logo />
      <LogInForm />

      <Box sx={{ my: { xs: 2, sm: 4, md: 8 }, flexGrow: 1, display: 'flex' }}>
        <Typography sx={{ mx: 'auto', mt: 'auto' }}>
          Don't have an account?{' '}
          <Link component={RouterLink} to='/auth/register' underline='hover'>
            Sign up!
          </Link>
        </Typography>
      </Box>
    </Container>
  )
}
