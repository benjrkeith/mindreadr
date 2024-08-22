import { getHeader } from 'src/auth'
import { USERS_URL, instance as axios } from 'src/common'

export async function uploadAvatar(file: File) {
  const url = `${USERS_URL}/avatar`

  const formData = new FormData()
  formData.append('file', file)

  const args = {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...getHeader(),
    },
  }

  const res = await axios.post(url, formData, args)
  return res.data
}
