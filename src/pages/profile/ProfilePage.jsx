import LayoutContainer from "../../components/elements/Container";
import ShadowBox from "../../components/elements/ShadowBox";
import CollectionImage from "../../components/elements/CollectionImage";
import SvgIconStyle from "../../components/elements/SvgIconStyle";
import AlertDialog from "../../components/elements/AlertDialog";
import { useState } from "react";
const ProfilePage = () => {
  const [openEditProfile, setOpenEditProfile] = useState(false);

  const handleCloseDialog = () => {
    setOpenEditProfile(false);
  };

  const handleSaveProfile = () => {};

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
    <div>
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
            <button
              onClick={() => {
                setOpenEditProfile(true);
              }}
              className="shadowBoxBtnSmall max-w-[15vh] h-[3rem] rounded-md top-4 right-4 absolute"
            >
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
                <div
                  key={index}
                  className="flex flex-col items-center border-2 border-black p-5 lg:p-2"
                >
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
                    Sinka Juliaah is a member of the Indonesian idol group
                    JKT48.
                  </div>
                  <div className="f-12-px bg-placeholder mt-5">
                    {el.expired}
                  </div>
                  <button className="btn btn-primary-large mt-2 mb-3">
                    RENEW NFT
                  </button>
                </div>
              );
            })}
          </div>
        </ShadowBox>
      </LayoutContainer>

      <AlertDialog open={openEditProfile} onClose={handleCloseDialog}>
        <div className="flex flex-row justify-between items-center bg-secondary text-white px-5 py-3 title-secondary border-b-2 border-black">
          EDIT PROFILE
          <img
            onClick={handleCloseDialog}
            src="/assets/icons/close-icon.svg"
            alt="close-icon"
          />
        </div>
        <div className="p-5">
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex flex-col justify-start items-center lg:items-start gap-4 min-w-[180px]">
              <div className="title-secondary">Profile Picture</div>
              <CollectionImage
                src="/assets/picture/sample1.png"
                className="max-w-[128px] h-[128px] w-full ml-1"
              />
              <button className="shadowBoxBtnSmall py-1 max-w-[90px] rounded-md text-center flex flex-row lg:ml-5">
                <div className="text-center m-auto color-pink font-medium">
                  Change
                </div>
              </button>
            </div>
            <div className="flex-col flex space-y-10 w-full">
              <div className="flex flex-col w-full gap-2 max-h-[60px]">
                <div className="title-secondary">Name</div>
                <input className=" border-placeholder rounded-md h-full " />
              </div>
              <div className="flex flex-col w-full gap-2">
                <div className="title-secondary">Bio</div>
                <textarea
                  rows={10}
                  className="p-3 border-placeholder rounded-md h-full "
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end mt-[10vh]">
            <button
              onClick={handleSaveProfile}
              className="btn btn-primary-large"
            >
              SAVE
            </button>
          </div>
        </div>
      </AlertDialog>
    </div>
  );
};

export default ProfilePage;
