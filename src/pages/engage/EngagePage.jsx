import { Zoom } from "@mui/material";
import dynamic from "next/dist/shared/lib/dynamic";
import { useEffect, useState } from "react";
import { useAccount, useClient, useNetwork, useSigner } from "wagmi";
import Discussion from "../../components/chat/Discussion";
import CircleAvatar from "../../components/elements/CircleAvatar";
import LayoutContainer from "../../components/elements/Container";
import NoItems from "../../components/elements/NoItems";
import ShadowBox from "../../components/elements/ShadowBox";
import SvgIconStyle from "../../components/elements/SvgIconStyle";
import Link from "next/link";
import { isEmpty } from "lodash";
import { Contract } from "ethers";
import { PGCORE_ABI } from "../../../utilities/PGCoreABI";
import { contractConfig } from "../../../utilities/contractConfig";
import { lockMeta } from "../explore/lockMeta";
import { useOrbis } from "../../context/OrbisContext";
import { useIdol } from "../../context/IdolContext";
const VideoStream = dynamic(
  () => import("../../components/videoplayer/VideoStream"),
  {
    ssr: false,
  }
);

const EngagePage = () => {
  const { data: signer, isError } = useSigner();
  const { address, isConnected } = useAccount();
  const [chatOnlyView, setChatOnlyView] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { providers, provider, getProvider } = useClient();
  const { chain, chains } = useNetwork();
  const { orbis, getConversations, conversations, createConversation } = useOrbis();


  const { engangeData } = useIdol()
  const [currentPBID, setCurrentPBID] = useState(null);
  const [blocked, setBlocked] = useState(true);

  const getUserProfile = async (userAddress) => {
    const { data: userDids, error: errorDids } = await orbis.getDids(
      userAddress
    );
    if (!errorDids && userDids.length) {
      const { data: profileData, error: profileError } = await orbis.getProfile(
        userDids[0].did
      );
      if (!profileError) return profileData.details;
    }
  };

  // const fetchIdols = async () => {
  //   setIsLoading(true);
  //   const contracts = new Contract(
  //     contractConfig.PGCORE_ADDRESS,
  //     PGCORE_ABI.abi,
  //     providers.entries().next().value[1]
  //   );
  //   const result = await contracts.getAllIdolData(1, 10);
  //   let tempData = [];
  //   for (var i = 0; i < result.length; i++) {
  //     if (
  //       result[i].idolAddress != "0x0000000000000000000000000000000000000000"
  //     ) {
  //       var tempMeta = await lockMeta(chain, result[i].lockAddress);
  //       const idolorbis = await getUserProfile(result[i].idolAddress);

  //       tempData.push({
  //         img: idolorbis?.profile?.pfp ?? "/assets/picture/placeholder.png",
  //         idolDid: idolorbis?.did ?? "",
  //         lockName: result[i].lockName,
  //         lockAddress: result[i].lockAddress,
  //         lockImage: result[i].lockImage,
  //         nftKeyAddress: result[i].nftKeyAddress,
  //         idolAddress: result[i].idolAddress,
  //         playbackID: tempMeta.stream_playbackId,
  //         streamID: tempMeta.stream_id,
  //         description: tempMeta.description,
  //         interest: tempMeta.interest,
  //         perks: tempMeta.perks,
  //         userName: idolorbis?.profile.name ?? "-",
  //         isLive: false,
  //         address: result[i].userAddress,
  //         groupRoom: [
  //           {
  //             title: "Fanbase",
  //             context: `${tempMeta.stream_id}-${result[i].idolAddress}`,
  //           },
  //         ],
  //       });
  //     }
  //   }
  //   setCurrentPBID(tempData[0].playbackID);

  //   if (tempData.length > 0) {
  //     setAccount(tempData);
  //   }
  //   setIsLoading(false);
  // };

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

  const [account, setAccount] = useState(null);

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
    if (engangeData) {
      if(!currentPBID){
        setCurrentPBID(engangeData[0].playbackID);
        getConversations();
      }
    }
  }, [engangeData])

  useEffect(() => {
    if(!engangeData){
      return
    }

    getConversations();
    setActiveRoom(engangeData[selectedAccount].groupRoom[0]);
    if (signer && !isLoading && engangeData[0].address != "") {
      checkTokenGate(engangeData[selectedAccount].idolAddress);
    }
  }, [selectedAccount])

  // useEffect(() => {
  //   // setAccount(account);
  //   if (!signer) {
  //     return setBlocked(true);
  //   }

  //   if(!engangeData){
  //     return
  //   }

  //   if(!currentPBID){
  //     setCurrentPBID(engangeData[0].playbackID);
  //   }
  //   getConversations();
  //   setActiveRoom(engangeData[selectedAccount].groupRoom[0]);
  //   if (signer && !isLoading && engangeData[0].address != "") {
  //     checkTokenGate(engangeData[selectedAccount].idolAddress);
  //   }
  // }, [selectedAccount, account, signer]);

  return (
    <Zoom in={true}>
      <div>
        <LayoutContainer>
          {!engangeData ? (
            <div className="h-[760px] w-full secondary shadowBox flex flex-row flex-wrap p-4">
              <div className="w-full h-full rounded-md animate-pulse bg-gray-200" />
            </div>
          ) : engangeData[0].address == "" ? (
            <NoItems description="No idol registered yet at this time, please come back later" />
          ) : (
            <ShadowBox className={"shadowBox"}>
              <div className="flex flex-col lg:flex-row">
                <div className={`w-full ${chatOnlyView ? "" : "lg:w-3/4"} `}>
                  {/* TAB */}
                  <div className="flex flex-row justify-start items-center bg-secondary text-white border-b-2 border-black">
                    <div className="flex flex-row w-full max-w-[300px]">
                      {tabs.map((el, index) => {
                        let liveActiveClass = "";

                        if(el.title === "LIVE"){
                          if(engangeData[selectedAccount]?.isLive){
                            liveActiveClass = "bg-active"
                          }else{
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
                      <div className="space-y-5 pb-3">
                        {engangeData.map((el, index) => {
                          return (
                            <div
                              onClick={() => {
                                setSelectedAccount(index);
                                setCurrentPBID(engangeData[index].playbackID);
                                // if (el.isLive == false) {
                                //   setChatOnlyView(true);
                                // } else {
                                //   setChatOnlyView(false);
                                // }
                              }}
                              className="px-[8px] relative"
                              key={index}
                            >
                              <CircleAvatar
                                address={el.idolAddress}
                                isLive={el.isLive}
                              />
                              <div
                                className={`absolute top-0 left-0 w-[5px] max-h-[55px] h-full transition-all duration-150 ${
                                  index == selectedAccount && "bg-highlight"
                                }  rounded-br-lg rounded-tr-lg`}
                              />
                            </div>
                          );
                        })}
                      </div>
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
                                engangeData[selectedAccount].idolDid
                              );
                              setActiveRoom({
                                title: engangeData[selectedAccount].userName,
                                context: res,
                                private: true,
                              });
                            }}
                            className={`mt-2 flex flex-row gap-3 ${
                              activeRoom.title ==
                                engangeData[selectedAccount].userName &&
                              "bg-[#F1848D] !text-white"
                            } items-center p-2 rounded-md`}
                          >
                            <SvgIconStyle
                              src={"/assets/icons/chatbubble-icon.svg"}
                              className={`!w-4 !h-4 ${
                                activeRoom.title ==
                                engangeData[selectedAccount].userName
                                  ? "bg-[#FFECEF]"
                                  : "bg-gray"
                              }`}
                            />
                            {engangeData[selectedAccount].userName}
                          </div> */}
                          <div className="f-12-px bg-placeholder mt-2">
                            Group Chat
                          </div>
                          <div className="flex flex-col mt-2">
                            {engangeData[selectedAccount].groupRoom.map(
                              (el, index) => {
                                return (
                                  <div
                                    key={index}
                                    onClick={() => {
                                      setActiveRoom(el);
                                    }}
                                    className={`flex flex-row justify-start items-start gap-3 gray items-center p-2 rounded-md ${
                                      activeRoom.title == el.title &&
                                      "bg-[#F1848D] !text-white"
                                    }`}
                                  >
                                    <SvgIconStyle
                                      src={"/assets/icons/group-icon.svg"}
                                      className={`!w-4 !h-4  ${
                                        activeRoom.title == el.title
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
                        playbackID={
                          currentPBID ?? engangeData[selectedAccount].playbackID
                        }
                        title={
                          isEmpty(currentPBID)
                            ? "-"
                            : engangeData[selectedAccount].lockName
                        }
                        userName={
                          isEmpty(currentPBID)
                            ? "-"
                            : engangeData[selectedAccount].userName
                        }
                        idolAddress={engangeData[selectedAccount].idolAddress}
                        isBlocked={blocked}
                        account={engangeData[selectedAccount]}
                      />
                    )}
                  </div>
                </div>

                {!chatOnlyView && (
                  <div className="lg:w-1/4  border-l-0 border-t-2 lg:border-t-0 lg:border-l-2 border-black secondary min-h-[530px] relative">
                    <Discussion
                      orbisContext={
                        currentPBID ?? engangeData[selectedAccount].playbackID
                      }
                      isBlocked={blocked}
                    />
                  </div>
                )}
                {/* --- */}
              </div>
            </ShadowBox>
          )}
        </LayoutContainer>
      </div>
    </Zoom>
  );
};

export default EngagePage;
