import axios from 'axios'

import { POSTS_URL } from './common'
import { getHeader } from '../services/Auth'

export default async function createPost (content: string): Promise<string> {
  const args = { headers: getHeader() }
  const body = { content }

  const response = await axios.post(POSTS_URL, body, args)
  return response.data
}
