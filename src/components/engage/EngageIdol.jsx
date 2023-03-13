/* eslint-disable react/display-name */
import { Zoom } from "@mui/material";
import dynamic from "next/dist/shared/lib/dynamic";
import { memo, useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import Discussion from "../chat/Discussion"
import CircleAvatar from "../elements/CircleAvatar"
import SvgIconStyle from "../elements/SvgIconStyle"
import Link from "next/link";
import { isEmpty } from "lodash";
import { Contract } from "ethers";
import { PGCORE_ABI } from "../../../utilities/PGCoreABI";
import { contractConfig } from "../../../utilities/contractConfig";
import { useOrbis } from "../../context/OrbisContext";

const VideoStream = dynamic(
  () => import("../videoplayer/VideoStream"),
  {
    ssr: false,
  }
);

import EngageIdolList from './EngageIdolList'

const EngageIdol = ({ selectedIdol, setSelectedIdol }) => {
  const { data: signer, isError } = useSigner();
  const { address, isConnected } = useAccount();
  const [chatOnlyView, setChatOnlyView] = useState(false);
  const { orbis, getConversations, conversations, createConversation } = useOrbis();

  const [blocked, setBlocked] = useState(true);

  const checkTokenGate = async (idolAddress) => {
    if (idolAddress == address) {
      return setBlocked(false);
    }
    console.log(`checking tokengate for ${idolAddress}`);
    const contracts = new Contract(
      contractConfig.PGCORE_ADDRESS,
      PGCORE_ABI.abi,
      signer
    );
    const result = await contracts.tokenGate(idolAddress);
    if (parseInt(result.toString()) >= 1) {
      setBlocked(false);
    } else {
      console.log("blocked");
      setBlocked(true);
    }
  };

  const [activeRoom, setActiveRoom] = useState({
    title: "Sinka",
    context: "private-sinka-123",
  });

  const [tabs, setTabs] = useState([
    {
      title: "CHAT",
      icon: "/assets/icons/chatbubble-icon.svg",
      isActive: false,
    },
    {
      title: "LIVE",
      icon: "/assets/icons/live-icon.svg",
      isActive: true,
    },
  ]);

  useEffect(() => {
    getConversations();
    setActiveRoom(selectedIdol.groupRoom[0]);
    if (signer && selectedIdol) {
      checkTokenGate(selectedIdol.idolAddress);
    }
  }, [selectedIdol])

  return (
    <>
      <div className="flex flex-col lg:flex-row">
        <div className={`w-full ${chatOnlyView ? "" : "lg:w-3/4"} `}>
          {/* TAB */}
          <div className="flex flex-row justify-start items-center bg-secondary text-white border-b-2 border-black">
            <div className="flex flex-row w-full max-w-[300px]">
              {tabs.map((el, index) => {
                let liveActiveClass = "";

                if (el.title === "LIVE") {
                  if (selectedIdol?.isLive) {
                    liveActiveClass = "bg-active"
                  } else {
                    liveActiveClass = "bg-gray-500"
                  }
                }

                return (
                  <div
                    onClick={() => {
                      if (chatOnlyView && tabs[index].title == "LIVE") {
                        setChatOnlyView(false);
                      } else if (
                        !chatOnlyView &&
                        tabs[index].title == "CHAT"
                      ) {
                        setChatOnlyView(true);
                      }

                      let temp = tabs;
                      for (var i = 0; i < temp.length; i++) {
                        temp[i].isActive = false;
                      }

                      if (el.isActive) {
                        temp[index].isActive = false;
                      } else {
                        temp[index].isActive = true;
                      }

                      setTabs(temp);
                    }}
                    key={index}
                    className={`flex flex-row border-r-2 border-r-black p-4 w-full 
                      font-medium max-w-[157px] justify-center ${liveActiveClass}
                      ${el.isActive ? "border-b-4 border-b-white" : "border-b-4 border-b-transparent"}`}
                  >
                    <img className="icons mr-2" src={el.icon} alt="" />
                    <div className="title-secondary">{el.title}</div>
                  </div>
                );
              })}
            </div>
            {/* <div className="ml-4 font-medium"> Live Streaming!</div> */}
          </div>
          {/* ---- */}
          <div className="flex flex-row ">
            {/* IDOL ACCOUNT */}
            <div className="pt-3 pb-2 border-r-2 border-black flex flex-col justify-between">
              <EngageIdolList selectedIdol={selectedIdol} setSelectedIdol={setSelectedIdol} setChatOnlyView={setChatOnlyView} />

              <div className="px-[8px] border-t-2 border-black pt-2">
                <Link href={"/profile"}>
                  <CircleAvatar
                    address={address}
                  />
                </Link>
              </div>
            </div>
            {/* ---- */}
            {chatOnlyView ? (
              <div className="w-full relative min-h-[630px] flex flex-col lg:flex-row">
                <div className="flex flex-col w-full lg:w-[230px] h-[200px] lg:h-full p-3 border-r-0 lg:border-r-2 border-black border-b-2 lg:border-b-0 overflow-auto shrink-0">
                  {/* <div className="f-12-px bg-placeholder">
                    Private Chat
                  </div> */}

                  {/* <div
                    onClick={async () => {
                      const res = await createConversation(
                        selectedIdol.idolDid
                      );
                      setActiveRoom({
                        title: selectedIdol.userName,
                        context: res,
                        private: true,
                      });
                    }}
                    className={`mt-2 flex flex-row gap-3 ${
                      activeRoom.title ==
                        selectedIdol.userName &&
                      "bg-[#F1848D] !text-white"
                    } items-center p-2 rounded-md`}
                  >
                    <SvgIconStyle
                      src={"/assets/icons/chatbubble-icon.svg"}
                      className={`!w-4 !h-4 ${
                        activeRoom.title ==
                        selectedIdol.userName
                          ? "bg-[#FFECEF]"
                          : "bg-gray"
                      }`}
                    />
                    {selectedIdol.userName}
                  </div> */}
                  <div className="f-12-px bg-placeholder mt-2">
                    Group Chat
                  </div>
                  <div className="flex flex-col mt-2">
                    {selectedIdol.groupRoom.map(
                      (el, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              setActiveRoom(el);
                            }}
                            className={`flex flex-row justify-start gap-3 gray items-center p-2 rounded-md ${activeRoom.title == el.title &&
                              "bg-[#F1848D] !text-white"
                              }`}
                          >
                            <SvgIconStyle
                              src={"/assets/icons/group-icon.svg"}
                              className={`!w-4 !h-4  ${activeRoom.title == el.title
                                ? "bg-[#FFECEF]"
                                : "bg-gray"
                                }`}
                            />
                            {el.title}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
                <Discussion
                  isAbsolute={false}
                  orbisContext={activeRoom?.context}
                  fire={activeRoom?.context}
                  isPrivate={activeRoom?.private}
                  isBlocked={blocked}
                />
              </div>
            ) : (
              <VideoStream
                playbackID={selectedIdol.playbackID}
                title={
                  isEmpty(selectedIdol.playbackID)
                    ? "-"
                    : selectedIdol.playbackID.lockName
                }
                userName={
                  isEmpty(selectedIdol.playbackID)
                    ? "-"
                    : selectedIdol.userName
                }
                idolAddress={selectedIdol.idolAddress}
                isBlocked={blocked}
                account={selectedIdol}
                isLive={selectedIdol.isLive}
              />
            )}
          </div>
        </div>

        {!chatOnlyView && (
          <div className="lg:w-1/4  border-l-0 border-t-2 lg:border-t-0 lg:border-l-2 border-black secondary min-h-[530px] relative">
            <Discussion
              orbisContext={
                selectedIdol.playbackID ?? selectedIdol.playbackID
              }
              isBlocked={blocked}
            />
          </div>
        )}
        {/* --- */}
      </div>
    </>
  );
};

export default memo(EngageIdol);
