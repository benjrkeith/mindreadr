import axios from 'axios'

import { getHeader } from '../services/Auth'
import { POSTS_URL } from './common'

export interface RawPost {
  key: number
  author: string
  content: string
  parent: number
  created_at: string
}

export async function getPosts (offset = 0, limit = 10): Promise<RawPost[]> {
  const args = { headers: getHeader(), params: { offset, limit } }
  const response = await axios.get(POSTS_URL, args)
  return response.data
}
