import React, { useEffect, type ReactElement, useCallback, useState } from 'react'
import { getFollowing } from '../api/getFollowing'

interface Props {
  target: string
  showFollowing: boolean
  setShowFollowing: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Following (props: Props): ReactElement {
  const [following, setFollowing] = useState<string[]>([])

  const callback = useCallback(async () => {
    const res = await getFollowing(props.target)
    setFollowing(res)
  }, [props.target])

  useEffect(() => { void callback() }, [props.target])

  if (!props.showFollowing) return <></>

  return (
    <div className='absolute h-dvh w-dvw bg-[#1e2124] z-20'>
        <div className='flex h-[10dvh] items-center border-b-2 border-solid border-white ml-4 mr-4'>
            <button type="button" onClick={() => { props.setShowFollowing(false) }}
                className='text-red-700 text-3xl p-3 col-[1] text-left font-semibold'>X</button>
            <p className='col-[2] grow text-right text-white p-3 align-middle justify-center font-semibold'>
                {following.length}
            </p>
        </div>
        <div className='flex flex-col gap-0.5 mt-2'>
            {following.map(user => <li key={user}
                className='text-white w-full text-center list-none'>
                    {user}
            </li>)}
        </div>
    </div>
  )
}
