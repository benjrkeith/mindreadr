import { getHeader } from 'src/auth'
import { instance as axios } from 'src/common'
import { POSTS_URL } from 'src/posts/api'

export async function createComment(postId: number, content: string) {
  const url = `${POSTS_URL}/${postId}/comments`
  const args = { headers: getHeader() }
  const res = await axios.post(url, { content }, args)
  return res.data
}
