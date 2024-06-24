import { API_URL } from 'src/common'

const AUTH_URL = `${API_URL}/auth`

export const LOGIN_URL = `${AUTH_URL}/login`
export const REGISTER_URL = `${AUTH_URL}/register`

export * from 'src/auth/api/logIn'
export * from 'src/auth/api/register'
