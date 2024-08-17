import { useNavigate } from 'react-router-dom'

interface StatProps {
  text: string
  value: number
  callback: () => void
}

export function Stat(props: StatProps) {
  const { text, value, callback } = props

  return (
    <button
      onClick={callback}
      className='mx-auto w-fit rounded-lg bg-dark_bg_1dp px-3 
      py-1 hover:bg-dark_bg_base'
    >
      <h1 className='text-lg font-medium leading-5'>{value}</h1>
      <p className='text-[0.6rem] leading-3'>{text}</p>
    </button>
  )
}

interface StatsProps {
  userId: number
  count: {
    followers: number
    following: number
    posts: number
  }
}

export function Stats({ userId, count }: StatsProps) {
  const navigate = useNavigate()

  return (
    <div className='grid grid-cols-3'>
      <Stat
        text='Followers'
        value={count.followers}
        callback={() => navigate(`/users/${userId}/followers`)}
      />
      <Stat text='Posts' value={count.posts} callback={() => {}} />
      <Stat
        text='Following'
        value={count.following}
        callback={() => navigate(`/users/${userId}/following`)}
      />
    </div>
  )
}
