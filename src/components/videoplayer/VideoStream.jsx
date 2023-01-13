import CircleAvatar from "../elements/CircleAvatar";
import SvgIconStyle from "../elements/SvgIconStyle";
import { Player, useCreateStream } from "@livepeer/react";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import VideoControl from "./VideoControl";
import Image from "next/image";
import getLivePeerStream from "../../../pages/api/livepeerAPI";

const VideoStream = ({
  playbackID,
  userName,
  title,
  idolAddress,
  isBlocked,
  account
}) => {
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

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if(playbackID){
      handleCheckStreamStatus()
    }
  }, [playbackID])

  const handleCheckStreamStatus = async () => {
    console.log("Check streams status");
    console.log("SELECTED ACCOUNT", account);
    // const stream = await getLivePeerStream(playbackID)
    // console.log("STREAM", stream);
  }

  console.log("PLAYBACK ID", playbackID);

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


        {isActive ?
          <>
            {(isBlocked) ? (
                <img
                    src="/assets/picture/blockbanner.png"
                    className="rounded-lg m-auto w-full"
                    alt="blocked"
                />

            ) : (
                <Player
                    showTitle={false}
                    playbackId={playbackID}
                    autoPlay
                    showPipButton
                    id="vidPlayer"
                    mediaElementRef={mediaElementRef}
                    priority
                    controls={{ autohide: 1500, hotkeys: true }}
                />
            )}
          </>
            :
          <div className="rounded-lg m-auto h-[32rem] w-full bg-gray-200 animate-pulse" />
        }

        <div className="flex flex-row pt-4 items-center flex-wrap pt-3">
          <CircleAvatar address={idolAddress} isActive={true} />
          <div className="pl-3">
            <div className="subtitle-secondary">{title}</div>
            <p className="text-black">{userName}</p>
          </div>

          <VideoControl disabled={isBlocked} vidRef={vidRef} />
        </div>
      </div>
    </div>
  );
};

export default VideoStream;
