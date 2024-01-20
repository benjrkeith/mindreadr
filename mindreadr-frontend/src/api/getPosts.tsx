import axios from 'axios'

import { getHeader } from '../services/Auth'
import { POSTS_URL } from './common'

export interface RawPost {
  key: number
  author: string
  content: string
  parent: number
  parent_author: string
  created_at: string
  likes: number
  liked: boolean
}

export async function getPosts (offset = 0, limit = 10): Promise<RawPost[]> {
  const args = { headers: getHeader(), params: { offset, limit } }
  const response = await axios.get(POSTS_URL, args)
  console.log(response.data)
  return response.data
}
