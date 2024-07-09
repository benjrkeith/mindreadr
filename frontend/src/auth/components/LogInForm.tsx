import { Box, Button, TextField } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { LogInDto, logIn } from 'src/auth/api'
import { cacheUser } from 'src/auth/services'
import { useUserStore } from 'src/store'

export function LogInForm() {
  const { setUser } = useUserStore()
  const navigate = useNavigate()

  // create a form with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    setError,
  } = useForm<LogInDto>()

  // mutation for posting login credentials
  const mutation = useMutation({
    mutationFn: logIn,
    onSuccess: (user) => {
      cacheUser(user)
      setUser(user)
      navigate('/users')
    },
    onError: (err: AxiosError) => {
      const status = err.response?.status
      if (status === 404)
        setError('username', { message: 'User could not be found' })
      else if (status === 401)
        setError('password', { message: 'Password is incorrect' })
    },
  })

  return (
    <Box
      component='form'
      onSubmit={handleSubmit((dto) => mutation.mutate(dto))}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
        gap: { xs: 1.5, sm: 2.5 },
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TextField
        id='username'
        label='Username'
        autoFocus
        autoComplete='off'
        spellCheck='false'
        fullWidth
        sx={{ width: '80%', maxWidth: 512 }}
        inputProps={{
          ...register('username', { required: 'Username is empty' }),
        }}
        helperText={(errors.username && errors.username.message) || ' '}
        error={Boolean(errors.username)}
      />

      <TextField
        id='password'
        label='Password'
        type='password'
        autoComplete='off'
        fullWidth
        sx={{ width: '80%' }}
        inputProps={{
          ...register('password', { required: 'Password is empty' }),
        }}
        helperText={(errors.password && errors.password.message) || ' '}
        error={Boolean(errors.password)}
      />

      <div />
      <Button
        variant='outlined'
        type='submit'
        disabled={!isDirty || !isValid || mutation.isPending}
        sx={{ width: '60%' }}
      >
        Log In
      </Button>
    </Box>
  )
}
