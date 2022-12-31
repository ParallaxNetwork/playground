import LayoutContainer from "../../components/elements/Container";
import ShadowBox from "../../components/elements/ShadowBox";
import CollectionImage from "../../components/elements/CollectionImage";
import SvgIconStyle from "../../components/elements/SvgIconStyle";
import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import NoItems from "../../components/elements/NoItems";
import { useAccount, useSigner } from "wagmi";
import { ShowToast } from "../../components/elements/Toaster";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { PGCORE_ABI } from "../../../utilities/PGCoreABI";
import EditProfileDialog from "./EditProfileDialog";
import RegisterDialog from "./RegisterDIalog";
import { contractConfig } from "../../../utilities/contractConfig";
import { ethers } from "ethers";
import { CircularProgress } from "@mui/material";
const ProfilePage = () => {
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const { data: signer, isError } = useSigner();
  const { address, isConnected } = useAccount();
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const web3 = new Web3Provider(window.ethereum);

  const handleCloseDialog = () => {
    setOpenEditProfile(false);
  };

  const handleCloseRegisterDialog = () => {
    setOpenRegisterDialog(false);
  };

  const handleSaveProfile = () => {};

  const handleRegisterIdol = async (data) => {
    const {
      duration,
      price,
      numberOfImages,
      subName,
      collectionImage,
      nftImage,
      nftImageURI,
      collectionImageURI,
      amount,
    } = data;
    console.log(data);
    const contracts = new Contract(
      contractConfig.PGCORE_ADDRESS,
      PGCORE_ABI.abi,
      signer
    );
    let transactionResponse;
    try {
      handleCloseRegisterDialog();
      transactionResponse = await contracts.createIdol(
        duration,
        ethers.utils.parseUnits(price, "ether"),
        parseInt(amount),
        parseInt(numberOfImages),
        subName,
        collectionImageURI,
        nftImageURI
      );
      ShowToast({
        message: "Working on it~",
      });
      const receipt = await transactionResponse.wait();
      if (receipt.status == 1) {
        ShowToast({
          message: "Subscription Created!",
        });
        await getIdolData();
      }
    } catch (e) {
      console.log(e);
      ShowToast({
        message: "oops something went wrong",
        state: "error",
      });
      handleCloseRegisterDialog();
    }
  };

  const getIdolData = async () => {
    try {
      setIsLoadingSubscription(true);
      const contracts = new Contract(
        contractConfig.PGCORE_ADDRESS,
        PGCORE_ABI.abi,
        signer
      );
      const result = await contracts.getSingleIdolData(address);
      setIsLoadingSubscription(false);
      console.log(result);
      return result;
      // return {
      //   balance,
      //   createdAt,
      //   idolAddress,
      //   lockAddress,
      //   lockName,
      //   nftKeyAddress,
      // } = result;
    } catch (e) {
      console.log(e);
      setIsLoadingSubscription(false);
    }
  };

  useEffect(() => {
    if (signer) {
      console.log(address);
      getIdolData();
    }
  }, [signer]);

  const nftCollection = [
    // {
    //   title: "Sinka's NFT",
    //   image: "/assets/picture/sample1.png",
    //   description: "asdasdasdasdasdasdasdsad",
    //   expired: "5 January 2024",
    // },
    // {
    //   title: "asdasd",
    //   image: "/assets/picture/sample1.png",
    //   description: "asdasdasdasdasdasdasdsad",
    //   expired: "5 January 2024",
    // },
  ];

  return (
    <div>
      <LayoutContainer>
        {isEmpty(address) ? (
          ""
        ) : (
          <>
            <ShadowBox className={"shadowBox"}>
              <div className="relative">
                <div className="flex flex-row justify-between">
                  <div className="items-center bg-secondary text-white px-5 py-3 title-primary border-b-2 border-r-2 border-black max-w-[230px] flex flex-row">
                    <img
                      src={"/assets/icons/star-icon.svg"}
                      className="mr-2 max-h-[20px]"
                    />{" "}
                    MY PROFILE
                  </div>
                  <button
                    onClick={() => {
                      if (address) {
                        setOpenEditProfile(true);
                      } else {
                        ShowToast({
                          message: "Please connect your wallet first",
                        });
                      }
                    }}
                    className="shadowBoxBtnSmall max-w-[15vh] h-[40px] rounded-md m-3"
                  >
                    <div className="m-auto subtitle">EDIT PROFILE</div>
                  </button>
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
                      <div>{"-"}</div>
                    </div>
                    <div className="max-w-full ml-0 lg:mt-0 lg:ml-5">
                      <div className="subtitle">Bio</div>
                      <div>{"JKT 48 Gen 8"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </ShadowBox>
            <ShadowBox className={"shadowBox mt-10"}>
              <div className="relative">
                <div className="flex flex-row justify-between">
                  <div className="items-center bg-secondary text-white px-5 py-3 title-primary border-b-2 border-r-2 border-black flex flex-row">
                    SUBSCRIPTION MANAGEMENT
                  </div>
                </div>
                <div className="flex m-5 flex-row p-2">
                  {/* <CollectionImage
                    src={"/assets/picture/sample1.png"}
                    className="max-w-[114px] h-[114px] w-full"
                  /> */}
                  <div className=" lg:mt-[-9px] flex flex-col justify-center w-full text-center max-w-lg m-auto flex-wrap break-all p-4">
                    <div className="subtitle mb-3">
                      You have not registered yet, tap below to start
                    </div>
                    <button
                      onClick={() => {
                        if (address && !isLoadingSubscription) {
                          setOpenRegisterDialog(true);
                        }
                      }}
                      className="shadowBoxBtn mt-2 mb-3 rounded-md"
                    >
                      <div className="p-3 m-auto">
                        {isLoadingSubscription ? (
                          <CircularProgress
                            color="inherit"
                            className="!w-5 !h-5 mt-1"
                          />
                        ) : (
                          "REGISTER"
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </ShadowBox>
          </>
        )}
        {isEmpty(nftCollection) ? (
          <div className={` ${isEmpty(address) ? "" : "mt-10 mb-10"}`}>
            <NoItems
              isFullPage={isEmpty(address) ? true : false}
              isFullWidth={isEmpty(address) ? false : true}
              description={
                address
                  ? "You don't have any subscription right now, Buy NFT to engage with your idol"
                  : "You are not connected 💔 please login using your wallet "
              }
            />
          </div>
        ) : (
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
        )}
      </LayoutContainer>

      <EditProfileDialog
        openEditProfile={openEditProfile}
        handleCloseDialog={handleCloseDialog}
        handleSaveProfile={handleSaveProfile}
      />

      <RegisterDialog
        openRegisterDialog={openRegisterDialog}
        handleCloseRegisterDialog={handleCloseRegisterDialog}
        handleSubmitRegister={(data) => {
          handleRegisterIdol(data);
        }}
      />
    </div>
  );
};

export default ProfilePage;
