import React from 'react'
import { useIdol } from '../../context/IdolContext'
import CircleAvatar from '../elements/CircleAvatar'

export default function EngangeExploreIdol({
  setSelectedIdol
}) {
  const { engangeData } = useIdol()

  const onClickIdol = (idol) => {
    setSelectedIdol(idol)
  }

  return (
    <div className='p-5'>
      <div className="text-xl font-semibold text-secondary">
        Explore Idol
      </div>

      <div>
        {engangeData ?
          <div className='grid grid-cols-12 gap-4 mt-5'>
            {engangeData.map((idol, index) => {
              return (
                <button
                  onClick={() => onClickIdol(idol)}
                  className='col-span-12 md:col-span-4 lg:col-span-3 border-black bg-white/30 hover:bg-white/80 active:bg-black/10 transition-colors border px-2 py-4'
                  key={idol?.address}
                >
                  <div className='flex flex-col items-center'>
                    <CircleAvatar address={idol?.address} isLive={idol?.isLive} className='!w-[6rem] !h-[6rem] object-cover !aspect-square border-2 border-black' />
                    <div className='subtitle-secondary mt-2'>
                      {idol?.userName}
                    </div>
                    <div className='text-black text-xs text-center'>
                      {idol?.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          :
          <div className='mt-5'>
            <div className='w-full h-[30rem] animate-pulse bg-gray-200 mt-3'></div>
          </div>
        }
      </div>
    </div>
  )
}
