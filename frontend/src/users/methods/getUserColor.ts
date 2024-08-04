export function getUserColor(username: string) {
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = (hash << 5) - hash + username.charCodeAt(i)
  }

  let color = '#'
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).substr(-2)
  }

  const useBlackText = parseInt(color.replace('#', ''), 16) > 0xffffff / 2

  return { color, useBlackText: !useBlackText }
}
