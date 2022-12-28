import LayoutContainer from "../../components/elements/Container";
import ShadowBox from "../../components/elements/ShadowBox";
import CollectionImage from "../../components/elements/CollectionImage";
import SvgIconStyle from "../../components/elements/SvgIconStyle";
const ProfilePage = () => {
  const nftCollection = [
    {
      title: "Sinka's NFT",
      image: "/assets/picture/sample1.png",
      description: "asdasdasdasdasdasdasdsad",
      expired: "5 January 2024",
    },
    {
      title: "asdasd",
      image: "/assets/picture/sample1.png",
      description: "asdasdasdasdasdasdasdsad",
      expired: "5 January 2024",
    },
    {
      title: "asdasd",
      image: "/assets/picture/sample1.png",
      description: "asdasdasdasdasdasdasdsad",
      expired: "5 January 2024",
    },
    {
      title: "asdasd",
      image: "/assets/picture/sample1.png",
      description: "asdasdasdasdasdasdasdsad",
      expired: "5 January 2024",
    },
    {
      title: "asdasd",
      image: "/assets/picture/sample1.png",
      description: "asdasdasdasdasdasdasdsad",
      expired: "5 January 2024",
    },
  ];

  return (
    <LayoutContainer>
      <ShadowBox className={"shadowBox"}>
        <div className="relative">
          <div className="items-center bg-secondary text-white px-5 py-3 title-primary border-b-2 border-r-2 border-black max-w-[190px]">
            MY PROFILE
          </div>
          <div className="flex m-5 flex-row p-2">
            <CollectionImage
              src={"/assets/picture/sample1.png"}
              className="max-w-[114px] h-[114px] w-full"
            />
            <div className="ml-5 lg:mt-[-9px] flex flex-row justify-start w-full  flex-wrap break-all">
              <div className="max-w-full lg:pr-5">
                <div className="subtitle">Name</div>
                <div>{"SINKA"}</div>
                <div className="subtitle lg:mt-5">Join Since</div>
                <div>{"December 2022"}</div>
              </div>
              <div className="max-w-full ml-0 lg:mt-0 lg:ml-5">
                <div className="subtitle">Bio</div>
                <div>{"JKT 48 Gen 8"}</div>
              </div>
            </div>
          </div>
          <button className="shadowBoxBtnSmall max-w-[15vh] h-[3rem] rounded-md top-4 right-4 absolute">
            <div className="m-auto subtitle">EDIT PROFILE</div>
          </button>
        </div>
      </ShadowBox>
      <ShadowBox className={"shadowBox mt-5"}>
        <div className="flex flex-row shrink grow-0 bg-secondary text-white px-5 py-3 title-primary border-b-2 border-r-2 border-black max-w-[300px]">
          My Collection (5)
        </div>
        <div className="grid grid-rows-1 lg:grid-cols-5 p-2 gap-3 m-4">
          {nftCollection.map((el, index) => {
            return (
              <div key={index} className="flex flex-col items-center border-2 border-black p-5 lg:p-2">
                <CollectionImage
                  src={"/assets/picture/sample1.png"}
                  className="w-full max-w-[413px] aspect-[1/1]"
                />
                <div className="flex gap-2 mt-3 subtitle items-center">
                  <SvgIconStyle
                    src={"/assets/icons/verified-icon.svg"}
                    className="w-[18px] h-[18px] bg-red shrink mr-2"
                  />
                  {el.title.toUpperCase()}
                </div>
                <div className="flex flex-wrap f-12-px text-center mt-3">
                  Sinka Juliaah is a member of the Indonesian idol group JKT48.
                </div>
                <div className="f-12-px bg-placeholder mt-5">{el.expired}</div>
                <button className="btn btn-primary-large mt-2 mb-3">
                  RENEW NFT
                </button>
              </div>
            );
          })}
        </div>
      </ShadowBox>
    </LayoutContainer>
  );
};

export default ProfilePage;
