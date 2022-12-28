import LayoutContainer from "../../components/elements/Container";
import ShadowBox from "../../components/elements/ShadowBox";
import CircleAvatar from "../../components/elements/CircleAvatar";
import dynamic from "next/dist/shared/lib/dynamic";
const VideoStream = dynamic(
  () => import("../../components/videoplayer/VideoStream"),
  {
    ssr: false,
  }
);
import ChatBox from "../../components/chat/ChatBox";
import SvgIconStyle from "../../components/elements/SvgIconStyle";
const EngagePage = () => {
  const account = [
    {
      img: "",
      isLive: false,
    },
    {
      img: "",
      isLive: true,
    },
    {
      img: "",
      isLive: false,
    },
  ];

  const tabs = [
    {
      title: "CHAT",
      icon: "/assets/icons/chatbubble-icon.svg",
      isActive: false,
      onClick: () => {},
    },
    {
      title: "LIVE",
      icon: "/assets/icons/live-icon.svg",
      isActive: true,
      onClick: () => {},
    },
  ];

  return (
    <LayoutContainer>
      <ShadowBox className={"shadowBox"}>
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-3/4">
            {/* TAB */}
            <div className="flex flex-row justify-start items-center bg-secondary text-white border-b-2 border-black">
              <div className="flex flex-row w-full max-w-[300px]">
                {tabs.map((el, index) => {
                  return (
                    <div
                      key={index}
                      className={`flex flex-row border-r-2 border-black p-4 w-full font-medium max-w-[157px] justify-center ${
                        el.isActive && "bg-active"
                      }`}
                    >
                      <img className="icons mr-2" src={el.icon} alt="" />
                      <div className="title-secondary">{el.title}</div>
                    </div>
                  );
                })}
              </div>
              <div className="ml-4 font-medium"> Live Streaming!</div>
            </div>
            {/* ---- */}
            <div className="flex flex-row ">
              {/* IDOL ACCOUNT */}
              <div className="pt-3 pb-2 border-r-2 border-black flex flex-col justify-between">
                <div className="space-y-5 pb-3">
                  {account.map((el, index) => {
                    return (
                      <div className="px-[8px] relative" key={index}>
                        <CircleAvatar isLive={el.isLive} />
                        <div
                          className={`absolute top-0 left-0 w-[5px] max-h-[55px] h-full ${
                            el.isLive && "bg-highlight"
                          }  rounded-br-lg rounded-tr-lg`}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="px-[8px] border-t-2 border-black pt-2">
                  <CircleAvatar />
                </div>
              </div>
              {/* ---- */}
              {/* VIDEO */}
              <VideoStream />
              {/* --- */}
            </div>
          </div>
          {/* CHAT */}
          <div className="lg:w-1/4  border-l-0 border-t-2 lg:border-t-0 lg:border-l-2 border-black secondary min-h-[530px] relative">
            <div className="absolute overflow-auto h-full p-3 pb-[8vh]">
              <ChatBox />
            </div>
            {/* ---- */}
            {/* REPLY BOX */}
            <div
              className="bg-input h-[4.61440
              rem] bg-placeholder absolute bottom-0 w-full pl-3 pr-3 pb-4 pt-4"
            >
              <div className="flex flex-row h-full space-x-3">
                <input className="inputBox border-placeholder rounded-md h-full w-full" />
                <button className="w-[50px] shadowBoxBtnSmall bg-placeholder rounded-md">
                  <SvgIconStyle
                    src={"/assets/icons/send-icon.svg"}
                    className="w-7 h-7 bg-highlight m-auto"
                  />
                </button>
              </div>
            </div>
            {/* ---- */}
          </div>
          {/* --- */}
        </div>
      </ShadowBox>
    </LayoutContainer>
  );
};

export default EngagePage;
