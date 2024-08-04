import axios from 'axios'
import { deleteUser } from 'src/auth'

export const instance = axios.create()
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      deleteUser()
      window.location.href = '/auth/login'
    } else return error
  },
)

export const API_URL = '/api'
export const USERS_URL = `${API_URL}/users`

export * from 'src/common/api/getAllUsernames'
