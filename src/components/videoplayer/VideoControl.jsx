import SvgIconStyle from "../elements/SvgIconStyle";
import { useState } from "react";
const VideoControl = ({ vidRef, disabled }) => {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div className="space-x-6 flex flex-row justify-center w-full pt-5 lg:pt-0">
      <button
        disabled={disabled}
        onClick={() => {
          if (vidRef.muted) {
            vidRef.volume = 1;
          } else {
            vidRef.volume = 0;
          }
          vidRef.muted = !vidRef.muted;
        }}
        className="btn p-[8px] bg-white border-2 border-black rounded-lg w-[48px] h-[48px] text-center"
      >
        <SvgIconStyle
          src={"/assets/icons/mute-icon.svg"}
          className="w-[26px] h-[26px] bg-highlight"
        />
      </button>
      <button
        disabled={disabled}
        onClick={() => {
          if (isPaused) {
            vidRef.play();
            setIsPaused(false);
          } else {
            vidRef.pause();
            setIsPaused(true);
          }
        }}
        className="btn p-[11.5px] bg-white border-2 border-black rounded-lg w-[48px] h-[48px] text-center m-auto"
      >
        <SvgIconStyle
          src={"/assets/icons/pause-icon.svg"}
          className="w-[20px] h-[20px] bg-highlight"
        />
      </button>
      <button
        disabled={disabled}
        onClick={() => {
          vidRef.requestFullscreen();
        }}
        className="btn p-[9.5px] bg-white border-2 border-black rounded-lg w-[48px] h-[48px] text-center"
      >
        <SvgIconStyle
          src={"/assets/icons/expand-icon.svg"}
          className="w-[24px] h-[24px] bg-highlight"
        />
      </button>
    </div>
  );
};

export default VideoControl;
