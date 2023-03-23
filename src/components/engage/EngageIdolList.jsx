import React from 'react'
import { useIdol } from '../../context/IdolContext'
import CircleAvatar from '../elements/CircleAvatar';

export default function EngageIdolList({ selectedIdol, setSelectedIdol, setChatOnlyView }) {
  const { engageData } = useIdol()

  return (
    <div className="space-y-5 pb-3">
      {engageData.map((el, index) => {
        return (
          <div
            onClick={() => {
              setSelectedIdol(el);
              if (el.isLive == false) {
                setChatOnlyView(true);
              } else {
                setChatOnlyView(false);
              }
            }}
            className="px-[8px] relative"
            key={index}
          >
            <CircleAvatar
              address={el.idolAddress}
              isLive={el.isLive}
              withPopover={true}
            />
            <div
              className={`absolute top-0 left-0 w-[5px] max-h-[55px] h-full transition-all duration-150 ${selectedIdol?.idolAddress === el?.idolAddress && "bg-highlight"} rounded-br-lg rounded-tr-lg`}
            />
          </div>
        );
      })}
    </div>
  )
}
