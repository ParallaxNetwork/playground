import CircleAvatar from "../elements/CircleAvatar";
import SvgIconStyle from "../elements/SvgIconStyle";
import { Player, useCreateStream } from "@livepeer/react";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import VideoControl from "./VideoControl";
const VideoStream = () => {
  const [streamName, setStreamName] = useState("Stream");
  const {
    mutate: createStream,
    data: stream,
    status,
  } = useCreateStream(streamName ? { name: streamName } : null);
  const isLoading = useMemo(() => status === "loading", [status]);
  const [vidRef, setVidRef] = useState();

  const mediaElementRef = useCallback((ref) => {
    setVidRef(ref);
  }, []);

  useEffect(() => {
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
          playbackId={"8d77i7yrboof2fod"}
          autoPlay
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

          <VideoControl vidRef={vidRef} />
        </div>
      </div>
    </div>
  );
};

export default VideoStream;
