import CircleAvatar from "../elements/CircleAvatar";
import SvgIconStyle from "../elements/SvgIconStyle";
import { Player, useCreateStream } from "@livepeer/react";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
const VideoStream = () => {
  const [streamName, setStreamName] = useState("Stream");
  const {
    mutate: createStream,
    data: stream,
    status,
  } = useCreateStream(streamName ? { name: streamName } : null);
  const isLoading = useMemo(() => status === "loading", [status]);
  const mediaElementRef = useCallback((ref) => {
    console.log(ref);
  }, []);

  let simulateClick = (elem) => {
    let evt = new MouseEvent("click", {
      bubbles: true,
      view: window,
    });
    elem.dispatchEvent(evt);
  };

  useEffect(() => {
    const k = document.getElementsByClassName("c-eSKoH");
    // setTimeout(() => {
    //   simulateClick(k[3]);
    // }, 3500);
  }, []);

  return (
    <div className="bg-[url('/assets/misc/pattern.svg')] w-full">
      <div className="p-5">
        {/* <img
          src="/assets/picture/sample2.png"
          className="rounded-lg m-auto w-full"
          alt=""
        /> */}

        {/* {stream?.playbackId && (
          <Player
            title={stream?.name}
            playbackId={stream?.playbackId}
            autoPlay
            muted
          />
        )} */}
        <Player
          showTitle={false}
          playbackId={"5538zgcby74dtpu7"}
          autoPlay
          muted
          showPipButton
          id="vidPlayer"
          mediaElementRef={mediaElementRef}
          priority
          controls={{ autohide: 1500, hotkeys: true }}
        />

        <div className="flex flex-row pt-4 items-center flex-wrap pt-3">
          <CircleAvatar isActive={true} />
          <div className="pl-3">
            <div className="subtitle-secondary">AITAKATA CONCERT</div>
            <p className="text-black">Yoaenale</p>
          </div>
          <div className="space-x-6 flex flex-row justify-center w-full pt-5 lg:pt-0">
            <button
              onClick={() => {
                mediaElementRef();
              }}
              className="btn p-[8px] bg-white border-2 border-black rounded-lg w-[48px] h-[48px] text-center"
            >
              <SvgIconStyle
                src={"/assets/icons/mute-icon.svg"}
                className="w-[26px] h-[26px] bg-highlight"
              />
            </button>
            <button
              onClick={() => {
                createStream?.();
              }}
              disabled={isLoading || !createStream}
              className="btn p-[11.5px] bg-white border-2 border-black rounded-lg w-[48px] h-[48px] text-center m-auto"
            >
              <SvgIconStyle
                src={"/assets/icons/pause-icon.svg"}
                className="w-[20px] h-[20px] bg-highlight"
              />
            </button>
            <button className="btn p-[9.5px] bg-white border-2 border-black rounded-lg w-[48px] h-[48px] text-center">
              <SvgIconStyle
                src={"/assets/icons/expand-icon.svg"}
                className="w-[24px] h-[24px] bg-highlight"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStream;
