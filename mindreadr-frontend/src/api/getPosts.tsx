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
  reposted: boolean
}

export async function getPosts (author = '', offset = 0, limit = 10): Promise<RawPost[]> {
  let params
  if (author === '') params = { offset, limit }
  else params = { offset, limit, author }

  const args = { headers: getHeader(), params }
  const response = await axios.get(POSTS_URL, args)

  console.log(response.data)
  return response.data
}
