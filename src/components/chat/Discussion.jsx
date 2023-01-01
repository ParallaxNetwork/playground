import SvgIconStyle from "../elements/SvgIconStyle";
import { useState, useEffect } from "react";
import { useOrbis } from "../../context/OrbisContext";
import CircleAvatar from "../elements/CircleAvatar";
import { isEmpty } from "lodash";
import { DateTime } from "luxon";
import { shortAddress, didToAddress } from "../../../utilities/addressUtils";

import { CircularProgress } from "@mui/material";
const Discussion = ({
  orbisContext,
  isAbsolute = true,
  fire,
  isBlocked,
  isPrivate = false,
}) => {
  const { orbis } = useOrbis();
  const [isLoading, setIsLoading] = useState();
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [discussionData, setDiscussionData] = useState([]);
  const getOrbisData = async (withLoading) => {
    if (withLoading) {
      setIsLoading(true);
    }

    const { data, error } = await orbis.getPosts({ context: orbisContext });
    console.log(orbisContext);
    if (!error && data) {
      setDiscussionData(data.reverse());
    }

    if (withLoading) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOrbisData(true);
  }, [fire]);

  // run getOrbisData(false) function every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (orbisContext) getOrbisData(false);
    }, 7000);

    return () => clearInterval(interval);
  }, [orbisContext]);

  const handleSend = async () => {
    setIsSending(true);

    if (isEmpty(messageInput.trim())) {
      return;
    }
    let res;
    setMessageInput("");
    if (isPrivate) {
      res = await orbis.sendMessage({
        conversation_id: context,
        body: messageInput,
      });
    } else {
      res = await orbis.createPost({
        context: orbisContext,
        body: messageInput,
      });
    }

    if (res.status == 200) {
      setTimeout(() => {
        if (orbisContext) getOrbisData();

        setIsSending(false);
      }, 2000);
    }
  };

  const timestampToRelativeTime = (timestamp) =>
    DateTime.fromMillis(timestamp * 1000).toRelative({ style: "short" });
  return (
    <>
      <div
        className={` ${
          isAbsolute && "absolute"
        } overflow-auto h-full p-3 pb-[8vh] w-full max-h-[650px]`}
      >
        <div>
          {isBlocked ? (
            <div className="text-center h-full flex flex-col items-center justify-center">
              <div className="mt-[15vh]">
                {`You don't have subscription, Please Subscribe to this channel`}
              </div>
            </div>
          ) : isLoading ? (
            <div className="text-center h-full flex flex-col items-center justify-center">
              <CircularProgress
                color="error"
                className="!w-[40px] !h-[40px] mt-[20vh]"
              />
            </div>
          ) : (
            discussionData.map((el, index) => {
              return (
                <div key={index} className="flex flex-row p-1 pt-4 pb-4">
                  <CircleAvatar
                    className="!w-[33px] !h-[33px]"
                    image={el?.creator_details?.profile?.pfp}
                    address={didToAddress(el?.creator_details?.did)}
                  />
                  <div className="flex flex-col mx-3">
                    <div className="flex flex-row  items-end space-x-2">
                      <div className="bg-placeholder font-medium f-12-px">
                        {el.creator_details.profile?.username ||
                          el.creator_details.metadata.ensName ||
                          shortAddress(didToAddress(el.creator_details.did))}
                      </div>
                      <div className="bg-placeholder f-10-px bg-description">
                        {timestampToRelativeTime(el.timestamp)}
                      </div>
                    </div>
                    <div className="f-12-px text-[#2E2D44] pt-1">
                      {isBlocked ? "" : el.content?.body}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* ---- */}
      {/* REPLY BOX */}
      <div
        className={`flex ${
          isAbsolute ? "h-[4.61440rem]" : "h-[4rem]"
        } bg-placeholder absolute bottom-0 w-full pl-3 pr-3 pb-4  justify-end ${
          isAbsolute && "pt-4"
        }`}
      >
        <div
          className={`flex flex-row h-full w-full w-[1000px] md:w-[1000px] lg:w-[77%] xl:w-[80%] space-x-3 ${
            isAbsolute && "!w-full"
          } `}
        >
          <input
            onChange={(e) => setMessageInput(e.target.value)}
            value={messageInput}
            className="inputBox border-placeholder rounded-md h-full w-full bg-input "
          />
          <button
            onClick={handleSend}
            disabled={isSending || isBlocked}
            className="w-[50px] shadowBoxBtnSmall bg-placeholder rounded-md"
          >
            {isSending ? (
              <CircularProgress color="inherit" className="!w-5 !h-5 m-auto" />
            ) : (
              <SvgIconStyle
                src={"/assets/icons/send-icon.svg"}
                className="w-7 h-7 bg-highlight m-auto"
              />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Discussion;
