import React, { useEffect, type ReactElement, useCallback, useState } from 'react'
import { getFollowers } from '../api/getFollowers'

interface Props {
  target: string
  showFollowers: boolean
  setShowFollowers: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Followers (props: Props): ReactElement {
  const [followers, setFollowers] = useState<string[]>([])

  const callback = useCallback(async () => {
    const res = await getFollowers(props.target)
    setFollowers(res)
  }, [props.target])

  useEffect(() => { void callback() }, [props.target])

  if (!props.showFollowers) return <></>

  return (
    <div className='absolute h-dvh w-dvw bg-[#1e2124] z-10'>
        <div className='flex h-[10dvh] items-center border-b-2 border-solid border-white ml-4 mr-4'>
            <button type="button" onClick={() => { props.setShowFollowers(false) }}
                className='text-red-700 text-3xl p-3 col-[1] text-left font-semibold'>X</button>
            <p className='col-[2] grow text-right text-white p-3 align-middle justify-center font-semibold'>
                100
            </p>
        </div>
        <div className='flex flex-col gap-0.5 mt-2'>
            {followers.map(follower => <li key={follower}
                className='text-white w-full text-center list-none'>
                    {follower}
            </li>)}
        </div>
    </div>
  )
}
