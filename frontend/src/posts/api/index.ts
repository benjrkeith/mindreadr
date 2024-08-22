import { API_URL } from 'src/common'
export const POSTS_URL = `${API_URL}/posts`

export * from 'src/posts/api/createComment'
export * from 'src/posts/api/createPost'
export * from 'src/posts/api/getPost'
export * from 'src/posts/api/getPosts'
export * from 'src/posts/api/toggleLike'
