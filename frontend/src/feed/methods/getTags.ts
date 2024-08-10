import { types } from 'src/common'

export const UNRESOLVED_TAG_RE = /@[\w\d]+/
export const RESOLVED_TAG_RE = /@\u200b[\w\d]+/g

export const getTags = (content: string, data: types.User[] = []) => {
  const matches = UNRESOLVED_TAG_RE.exec(content)
  if (matches === null) return undefined

  const users = data.filter(
    (user) =>
      user.username.startsWith(matches[0].replace('@', '')) &&
      !content.match(RESOLVED_TAG_RE)?.includes(`@\u200b${user.username}`),
  )

  if (users.length === 0) return undefined
  return { match: matches, results: users }
}
