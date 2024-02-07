import axios from 'axios'

import { getHeader } from '../services/auth'
import { API_URL } from './common'

export default async function handleLike (key: number, liked: boolean,
  setLikes: React.Dispatch<React.SetStateAction<number>>,
  setLiked: React.Dispatch<React.SetStateAction<boolean>>): Promise<void> {
  const URL = `${API_URL}/posts/${key}/likes`
  const header = getHeader()

  if (liked) {
    await axios.delete(URL, { headers: header })
    setLikes((prev) => Number(prev) - 1)
    setLiked(false)
  } else {
    await axios.post(URL, {}, { headers: header })
    setLikes((prev) => Number(prev) + 1)
    setLiked(true)
  }
}
