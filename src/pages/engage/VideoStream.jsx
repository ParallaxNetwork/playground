import CircleAvatar from "../../components/elements/CircleAvatar";
import SvgIconStyle from "../../components/elements/SvgIconStyle";
const VideoStream = () => {
  return (
    <div className="bg-[url('/assets/misc/pattern.svg')] w-full">
      <div className="p-5">
        <img
          src="/assets/picture/sample2.png"
          className="rounded-lg m-auto w-full"
          alt=""
        />
        <div className="flex flex-row pt-4 items-center flex-wrap pt-3">
          <CircleAvatar isActive={true} />
          <div className="pl-3">
            <div className="subtitle-secondary">AITAKATA CONCERT</div>
            <p className="text-black">Yoaenale</p>
          </div>
          <div className="space-x-6 flex flex-row justify-center w-full pt-5 lg:pt-0">
            <div className="p-[8px] bg-white border-2 border-black rounded-lg w-[48px] h-[48px] text-center">
              <SvgIconStyle
                src={"/assets/icons/mute-icon.svg"}
                className="w-[26px] h-[26px] bg-highlight"
              />
            </div>
            <div className="p-[11.5px] bg-white border-2 border-black rounded-lg w-[48px] h-[48px] text-center m-auto">
              <SvgIconStyle
                src={"/assets/icons/pause-icon.svg"}
                className="w-[20px] h-[20px] bg-highlight"
              />
            </div>
            <div className="p-[9.5px] bg-white border-2 border-black rounded-lg w-[48px] h-[48px] text-center">
              <SvgIconStyle
                src={"/assets/icons/expand-icon.svg"}
                className="w-[24px] h-[24px] bg-highlight"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStream;
