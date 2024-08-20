import axios from 'axios'

import { getHeader } from 'src/auth'
import { API_URL } from 'src/common'

export async function toggleLike(postId: number, liked: boolean) {
  const url = `${API_URL}/posts/${postId}/likes`
  const args = { headers: getHeader() }

  if (liked) {
    return await axios.delete(url, args)
  } else {
    return await axios.post(url, {}, args)
  }
}
