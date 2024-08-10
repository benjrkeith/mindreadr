import { types } from 'src/common'

export const UNRESOLVED_TAG_RE = /@[\w\d]+/g
export const RESOLVED_TAG_RE = /@\u200b[\w\d]+\u200b/g

export const getTags = (
  _content: string,
  offset: number = 0,
  data: types.User[] = [],
) => {
  const content = _content.substring(0, offset)

  UNRESOLVED_TAG_RE.lastIndex = 0
  let match = UNRESOLVED_TAG_RE.exec(content)
  while (match !== null) {
    if (match.index < offset && match.index + match[0].length >= offset) break
    match = UNRESOLVED_TAG_RE.exec(content)
  }

  if (match === null) return undefined
  const users = data.filter(
    (user) =>
      user.username.startsWith(match[0].replace('@', '')) &&
      !content
        .match(RESOLVED_TAG_RE)
        ?.includes(`@\u200b${user.username}\u200b`),
  )

  if (users.length === 0) return undefined
  return { match, results: users }
}
