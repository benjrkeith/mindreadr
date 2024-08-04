export function toTitleCase(str: string) {
  const firstChar = str.charAt(0).toUpperCase()
  return firstChar + str.slice(1)
}
