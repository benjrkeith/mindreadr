import { cls, types } from 'src/common'
import { getUserColor } from 'src/users'

interface AvatarProps {
  user: types.User
  sx?: string
}

export function Avatar({ user, sx }: AvatarProps) {
  const { color, useBlackText } = getUserColor(user.username)

  if (user.avatar)
    return (
      <img
        src={user.avatar}
        className={cls(
          'aspect-square object-cover shadow-[0px_0px_10px] shadow-black/20',
          sx,
        )}
      />
    )
  else
    return (
      <div
        style={{ backgroundColor: color }}
        className={cls(
          'flex aspect-square text-3xl shadow-[0px_0px_10px] shadow-black/20',
          sx,
          {
            'text-black': useBlackText,
          },
        )}
      >
        <span className={cls('m-auto font-medium uppercase')}>
          {user.username.substring(0, 1)}
        </span>
      </div>
    )
}
