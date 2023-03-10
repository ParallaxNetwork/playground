import CircleAvatar from "../elements/CircleAvatar";
import SvgIconStyle from "../elements/SvgIconStyle";
import { Player, useCreateStream } from "@livepeer/react";
import { useState, useMemo, useCallback, useRef, useEffect, memo } from "react";
import VideoControl from "./VideoControl";
import Image from "next/image";
import { getLivePeerStream } from "../../../pages/api/livepeerAPI";

const VideoStream = ({
  playbackID,
  userName,
  title,
  idolAddress,
  isBlocked,
  account,
  isLive
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

  const [isChecked, setisChecked] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (playbackID) {
      handleCheckStreamStatus();
    }
  }, [playbackID]);

  const handleCheckStreamStatus = async () => {
    if (!isLive) {
      setIsActive(false);
    } else {
      console.log("CHECK STREAM STATUS")
      const stream = await getLivePeerStream(playbackID);
      console.log("STREAM", stream);

      if (stream?.isActive) {
        console.log("STREAM IS ACTIVE");
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    }

    setisChecked(true);
  };

  return (
    <div className="bg-[url('/assets/misc/pattern.svg')] w-full">
      <div className="p-5">
        {isChecked ? (
          <>
            {isBlocked || !isActive ? (
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
        ) : (
          <div className="rounded-lg m-auto h-[32rem] w-full bg-gray-200 animate-pulse" />
        )}

        <div className="flex flex-row pt-4 items-center flex-wrap">
          <CircleAvatar address={idolAddress} isActive={true} key={idolAddress} />

          <div className="pl-3">
            <div className="subtitle-secondary">{title}</div>
            <p className="text-black">{userName}</p>
          </div>

          {/* <VideoControl disabled={isBlocked} vidRef={vidRef} /> */}
        </div>
      </div>
    </div>
  );
};

export default memo(VideoStream);
