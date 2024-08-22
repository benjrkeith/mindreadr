import axios from 'axios'

import { getHeader } from 'src/auth'
import { types } from 'src/common'
import { POSTS_URL } from 'src/posts/api'

export async function createPost(content: string): Promise<types.Post> {
  const args = { headers: getHeader() }
  const res = await axios.post(POSTS_URL, { content }, args)
  return res.data
}
