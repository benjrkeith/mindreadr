import { cls, types } from 'src/common'
import { getUserColor } from 'src/users'

interface AvatarProps {
  user: types.User
  sx?: string
}

export function Avatar({ user, sx }: AvatarProps) {
  const { color, useBlackText } = getUserColor(user.username)

  return (
    <img
      src={user.avatar}
      alt={user.username.substring(0, 1)}
      style={{ backgroundColor: color }}
      className={cls(
        `flex aspect-square items-center justify-center object-cover text-3xl 
        font-semibold uppercase shadow-[0px_0px_10px] shadow-black/20`,
        sx,
        { 'text-black': useBlackText },
      )}
    />
  )
}
