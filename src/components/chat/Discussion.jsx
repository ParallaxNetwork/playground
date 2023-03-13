import SvgIconStyle from "../elements/SvgIconStyle";
import { useState, useEffect, useRef } from "react";
import { useOrbis } from "../../context/OrbisContext";
import CircleAvatar from "../elements/CircleAvatar";
import { isEmpty } from "lodash";
import { DateTime } from "luxon";
import { shortAddress, didToAddress } from "../../../utilities/addressUtils";

import { CircularProgress } from "@mui/material";

let isScrollingManually = false;
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
    }, 3000);

    return () => clearInterval(interval);
  }, [orbisContext]);

  const containerRef = useRef(null);
  const chatRef = useRef(null);
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    setIsSending(true);

    if (isEmpty(messageInput.trim())) {
      return;
    }
    let res;
    setMessageInput("");
    if (isPrivate) {
      // res = await orbis.sendMessage({
      //   conversation_id: context,
      //   body: messageInput,
      // });
    } else {
      res = await orbis.createPost({
        context: orbisContext,
        body: messageInput,
      });
    }

    isScrollingManually = false;

    if (res.status == 200) {
      setTimeout(() => {
        if (orbisContext) getOrbisData();
        setIsSending(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      // scroll to most bottom of containerRef based on chatRef height
      if (!isScrollingManually) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight + 400,
          behavior: "smooth",
        });
      }
    }
  }, [discussionData])

  // Detect is used scrolling containerRef, disable auto scroll to bottom
  useEffect(() => {
    let isScrolling;
    containerRef.current.addEventListener("scroll", () => {
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        // is scrolled to bottom
        if (
          containerRef.current.scrollTop + containerRef.current.clientHeight >=
          containerRef.current.scrollHeight
        ) {
          isScrollingManually = false;
        } else {
          isScrollingManually = true;
        }
      }, 66);
    });
  }, []);

  const timestampToRelativeTime = (timestamp) =>
    DateTime.fromMillis(timestamp * 1000).toRelative({ style: "short" });
  return (
    <div className="flex flex-col h-full">
      <div
        ref={containerRef}
        className={`p-3 pb-[2rem] w-full grow h-[42rem] overflow-scroll`}
      >
        <div className="h-full flex flex-col" ref={chatRef}>
          {isBlocked ? (
            <div className="text-center h-full flex flex-col items-center justify-center">
              <div className="mt-[15vh]">
                {`You don't have subscription, Please Subscribe to this channel first!`}
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
          <div className="hidden" ref={chatEndRef} />
        </div>
      </div>

      {!isBlocked &&
        <div
          className={`flex ${isAbsolute ? "h-[4.61440rem]" : "h-[4rem]"
            } bg-placeholder w-full pl-3 pr-3 pb-4  justify-end ${isAbsolute && "pt-4"
            }`}
        >
          <div
            className={`flex flex-row h-full w-full space-x-3 ${isAbsolute && "!w-full"
              } `}
          >
            <input
              onChange={(e) => setMessageInput(e.target.value)}
              value={messageInput}
              className="inputBox border-placeholder rounded-md h-full w-full bg-input "
              // run handleSend function when user press enter
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
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
      }
    </div>
  );
};

export default Discussion;
