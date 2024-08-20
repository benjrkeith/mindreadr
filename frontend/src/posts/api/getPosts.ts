import { getHeader } from 'src/auth'
import { instance as axios, types } from 'src/common'
import { POSTS_URL } from 'src/posts/api'

export interface PostResponse extends types.Post {
  _count: {
    likes: number
    comments: number
  }
}

export async function getPosts(
  skip: number,
  take: number,
  author?: string,
): Promise<PostResponse[]> {
  const args = { headers: getHeader(), params: { skip, take, author } }
  const response = await axios.get(POSTS_URL, args)
  return response.data.reverse()
}
