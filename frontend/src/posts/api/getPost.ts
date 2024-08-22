import { getHeader } from 'src/auth'
import { instance as axios } from 'src/common'
import { POSTS_URL, PostResponse } from 'src/posts/api'

export async function getPost(id: number): Promise<PostResponse> {
  const url = `${POSTS_URL}/${id}`
  const args = { headers: getHeader() }
  const response = await axios.get(url, args)
  return response.data
}
