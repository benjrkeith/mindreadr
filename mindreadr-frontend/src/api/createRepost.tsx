import axios from 'axios'

import { POSTS_URL } from './common'
import { getHeader } from '../services/auth'
import { type RawPost } from './getPosts'

export default async function createRepost (key: number, reposted: boolean, content: string): Promise<void> {
  const URL = `${POSTS_URL}/${key}/replies`
  const header = getHeader()

  if (!reposted) {
    const res = await axios.post(URL, { content }, { headers: header })
    const post: RawPost = res.data
    console.log(post)
  }
}
