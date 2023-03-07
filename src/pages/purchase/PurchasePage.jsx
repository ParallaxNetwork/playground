import { CircularProgress, Zoom } from "@mui/material";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { Contract, ethers } from "ethers";

import LayoutContainer from "../../components/elements/Container";
import ShadowBox from "../../components/elements/ShadowBox";
import CollectionImage from "../../components/elements/CollectionImage";
import SvgIconStyle from "../../components/elements/SvgIconStyle";
import AlertDialog from "../../components/elements/AlertDialog";

import { lockMeta } from "../explore/lockMeta";
import { useOrbis } from "../../context/OrbisContext";

import { ShowToast } from "../../components/elements/Toaster";
import MerchandiseDialog from "./MerchandiseDialog";

import { useUser } from "../../context/UserContext";
import { useUnlock } from "../../context/UnlockContext";

const PurchasePages = () => {
  const user = useUser();
  const unlock = useUnlock();

  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);
  const router = useRouter();
  const { lockAddress, nftAddress } = router.query;
  const { orbis } = useOrbis();
  const { data: signer, isError } = useSigner();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [openMerchandiseDialog, setOpenMerchandiseDialog] = useState(false);
  const [imgMerchandise, setImgMerchandise] = useState();
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    join_since: "",
  });
  const [lockDetail, setLockDetail] = useState({
    perks: ["Group Chat 12 days", "Private Chat", "Exlusive Live Video Access"],
    price: {
      hex: "0x2386f26fc10000",
      type: "BigNumber",
    },
    duration: 1036800,
    interest: null,
    stream_id: "314bddd1-2cb6-4348-b55a-641354e0bb0c",
    stream_url: "https://livepeercdn.com/hls/314bwkepyjqfp1ms/index.m3u8",
    description: "",
    lockAddress: "",
    nftImageURI: ["/assets/picture/placeholder.png"],
    stream_name: ".",
    idolAddress: "",
    stream_playbackId: "314bwkepyjqfp1ms",
    collectionImageURI: "/assets/picture/placeholder.png",
  });
  const { chain } = useNetwork();

  const handleCloseDialog = () => {
    setOpenPurchaseDialog(false);
  };

  const handleCloseMerchandiseDialog = () => {
    setOpenMerchandiseDialog(false);
  };

  useEffect(() => {
    if (lockAddress) {
      lockMeta(chain, lockAddress).then((resp) => {
        getUserProfile(resp);
        getSampleImagenft(resp);
      });
    }
  }, [lockAddress]);

  const getUserProfile = async (resp) => {
    try {
      const { data: userDids, error: errorDids } = await orbis.getDids(
        resp.idolAddress
      );
      if (!errorDids && userDids.length) {
        const { data: profileData, error: profileError } = await orbis.getProfile(
          userDids[0].did
        );
        console.log(profileData);
        if (!profileError) setProfileData(profileData.details.profile);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log("PROFILE DATA", profileData)
  }, [profileData])

  const handlePurchase = async () => {
    if (!signer) {
      handleCloseDialog();
      return ShowToast({
        message: "Please connect your wallet beforehand",
        state: "error",
      });
    }

    setIsLoading(true);
    const purchase = await unlock.handlePurchaseSubscription(nftAddress, lockDetail);

    if (purchase.status === "success") {
      handleCloseDialog();
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const handleRenew = async () => {
    setIsLoading(true);
    await unlock.handleExtendKey(lockAddress, "1");
    setIsLoading(false);
  }

  const perks = [
    {
      title: "Group Chat 1 Month",
      description:
        "You can join exclusive group chat with Sinka and get the latest information",
    },
    {
      title: "Private Chat",
      description:
        "You can join exclusive group chat with Sinka and get the latest information",
    },
    {
      title: "Exclusive Live Video Access",
      description:
        "You can join exclusive group chat with Sinka and get the latest information",
    },
  ];

  const sellItem = [
    {
      title: "Bucket Hat",
      image: "/assets/picture/bucket-hat.jpg",
      description: "Sinka's preloved bucket hat, i bet you like it",
      price: "0.01 MATIC",
    },
    {
      title: "BY Cardigan",
      image: "/assets/picture/cardigan.jpg",
      description: "Rewind back a few years ago, such a memorable items",
      price: "0.02 MATIC",
    },
  ];

  const getSampleImagenft = async (resp) => {
    const result = await fetch(`${resp.nftImageURI}/1`);
    const result2 = await fetch(`${resp.nftImageURI}/2`);
    const result3 = await fetch(`${resp.nftImageURI}/3`);
    const res = await result.json();
    const res2 = await result2.json();
    const res3 = await result3.json();

    console.log("RESP", resp);

    const lockDetail = {
      ...resp,
      nftImageURI: [
        res.image,
        res2?.image ?? "/assets/picture/placeholder.png",
        res3?.image ?? "/assets/picture/placeholder.png",
      ],
      nftDescription: res.description,
    }

    console.log("LOCK DETAIL", lockDetail);

    setLockDetail(lockDetail);
    //console.log(lockDetail);
  };

  return (
    <>
      <LayoutContainer>
        <Link href="/explore" className="inline-flex">
          <button className="shadowBoxBtnSmall py-2 px-4 rounded-[10px] text-center flex flex-row mb-5 bg-white">
            <div className="text-center m-auto font-medium flex flex-row gap-2">
              <SvgIconStyle
                src={"/assets/icons/arrowprev-icon.svg"}
                className="bg-red w-[15px] h-[15px] mt-[1px] md:mt-1"
              />
              Explore
            </div>
          </button>
        </Link>

        <ShadowBox className={"shadowBox mb-10"}>
          <div className="flex flex-row justify-between items-center bg-secondary text-white px-5 py-3 title-primary border-b-2 border-black">
            {`${lockDetail.stream_name}`}

            <div className="flex flex-row items-center">
              {user.isSubscribed(lockDetail.lockAddress) &&
                <div className="bg-white text-black text-sm mr-2 border border-black p-2 font-semibold">
                  Subscribed
                </div>
              }

              <img src="/assets/icons/hearts-icon.svg" alt="" />
            </div>
          </div>

          <div className="p-7">
            <div className="flex flex-col sm:flex-row items-start">
              {profileData.pfp ?
                // <CollectionImage
                //   src={profileData.pfp ?? "/assets/picture/placeholder.png"}
                //   className="w-full max-w-[12rem] mx-auto"
                // />
                <img
                  src={profileData.pfp ?? "/assets/picture/placeholder.png"}
                  alt=""
                  className="w-full max-w-[15rem] ring-black ring-2 mx-auto"
                />
                :
                <div
                  className="lg:max-w-[250px] aspect-square w-full bg-gray-200 animate-pulse"
                />
              }

              <div className="mt-5 text-center items-center sm:items-start sm:text-start w-full sm:ml-4 sm:mt-0 flex-1 flex flex-col lg:flex-row">
                <div className="break-all w-full flex flex-col">
                  <div className="subtitle">
                    Profile
                  </div>

                  {profileData.name ?
                    <div>
                      {`${profileData.name}`}
                    </div>
                    :
                    <div className="h-8 w-full max-w-[16rem] animate-pulse bg-gray-200 rounded-md" />
                  }

                  <div className="subtitle mt-4">
                    Bio
                  </div>

                  {profileData.bio ?
                    <div>
                      {`${profileData.bio}`}
                    </div>
                    :
                    <div className="h-16 w-full max-w-[32rem] animate-pulse bg-gray-200 rounded-md" />
                  }

                  {/* <div className="subtitle mt-4">Interest</div>
                  <div>{`${lockDetail.interest ?? "-"}`}</div> */}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Zoom in={true}>
                <div
                  className={`flex flex-col lg:flex-row border-2 border-black p-3 w-full gap-4`}
                >
                  <div className="lg:w-[500px] flex flex-row gap-2">
                    {/* <CollectionImage
                      src={`${lockDetail.nftImageURI[0]}`}
                      className="m-auto mt-5 mb-5 lg:m-0 "
                    /> */}
                    <img
                      src={profileData.pfp ?? "/assets/picture/placeholder.png"}
                      alt=""
                      className="w-full ring-black ring-2 m-auto mt-5 mb-5 lg:m-0 object-cover"
                    />
                    <div className="hidden lg:flex flex-col gap-2 w-[83px] shrink-0">
                      {lockDetail.nftImageURI.map((el, index) => {
                        return <CollectionImage key={index} src={`${el}`} />;
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between w-full gap-3 p-2 pt-0">
                    <div className="max-w-full w-full flex flex-col justify-between ">
                      <div>
                        <div className="title-primary">
                          {lockDetail.nftDescription}
                        </div>
                        <div className="f-12-px secondary">
                          Automatically owned every subscription purchased, 1pcs on
                          random
                        </div>
                        <div className="subtitle mt-2">{`${ethers.utils.formatEther(
                          parseInt(lockDetail.price.hex.toString()).toString()
                        )} MATIC`}</div>
                      </div>
                    </div>

                    <div className="max-w-[380px]">
                      <div className="subtitle">DESCRIPTION</div>
                      <div>
                        {lockDetail.description}
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row w-full justify-between">
                      <div className="mt-5 lg:mt-0 justify-end flex flex-col">
                        <div className="flex flex-row space-x-3">
                          <img src="/assets/icons/verified-icon.svg" alt="" />
                          <div className="subtitle">NFT PERKS</div>
                        </div>

                        <div className="mt-2">
                          {lockDetail.perks.map((el, index) => {
                            return (
                              <div
                                key={index}
                                className="block font-medium text-fill"
                              >
                                {el}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="h-full flex flex-col justify-end mt-3 mb-2 lg:mt-0 lg:mb-0">
                        <button
                          onClick={() => {
                            setOpenPurchaseDialog(true);
                          }}
                          className="btn btn-primary-large px-10"
                        >
                          {isLoading ? (
                            <CircularProgress
                              color="inherit"
                              className="!w-3 !h-3"
                            />
                          ) : (
                            "SUBSCRIBE"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Zoom>
            </div>

            <div className="mt-10">
              <div className="border-2 border-black p-4">
                <div className="title-primary">
                  Merchandise
                </div>

                <div className="opacity-60">
                  Coming soon
                </div>

                {/* <div className="grid grid-rows-1 lg:grid-cols-5 gap-3 mt-2">
                  {sellItem.map((el, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center border-2 border-black p-5 lg:p-2 justify-between"
                      >
                        <CollectionImage
                          src={el.image}
                          className="w-full max-w-[413px] aspect-[1/1]"
                        />
                        <div className="flex gap-2 mt-3 subtitle items-center">
                          {el.title}
                        </div>
                        <div className="flex flex-wrap f-12-px text-center mt-3">
                          {el.description}
                        </div>
                        <div className="f-12-px bg-placeholder mt-5 inline-flex flex-col text-center">
                          {el.price}
                          <button
                            onClick={() => {
                              setImgMerchandise({
                                image: el.image,
                                description: el.description,
                                title: el.title,
                                price: el.price,
                              });
                              setOpenMerchandiseDialog(true);
                            }}
                            className="btn btn-primary-large mt-2 mb-3"
                          >
                            BUY
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div> */}
              </div>
            </div>
          </div>
        </ShadowBox>
      </LayoutContainer>

      <MerchandiseDialog
        openMerchandiseDialog={openMerchandiseDialog}
        handleCloseMerchandiseDialog={handleCloseMerchandiseDialog}
        imageSrc={imgMerchandise}
      />

      <AlertDialog open={openPurchaseDialog} onClose={handleCloseDialog}>
        <div className="flex flex-row justify-between items-center bg-secondary text-white px-5 py-3 title-secondary border-b-2 border-black">
          BUY SUBSCRIPTION
          <img
            onClick={handleCloseDialog}
            src="/assets/icons/close-icon.svg"
            alt="close-icon"
          />
        </div>
        <div className="p-5">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex flex-col justify-start items-center lg:items-start min-w-[180px]">
              <CollectionImage
                src={lockDetail.nftImageURI[0]}
                className="max-w-[208px] w-full mt-2"
              />
            </div>
            <div className="flex-col flex space-y-10 w-full">
              <div className="flex flex-col w-full gap-1  max-h-[60px]">
                <div className="subtitle">DESCRIPTION</div>
                {lockDetail.description}
              </div>
              <div className="flex flex-col w-full gap-2">
                <div className="subtitle">NFT PERKS</div>
                {lockDetail.perks.map((el, index) => {
                  return (
                    <div key={index} className="flex flex-row gap-3">
                      <SvgIconStyle
                        src={"/assets/icons/love-icon.svg"}
                        className="bg-red w-[25px] h-[15px] mt-[1px] md:mt-1"
                      />
                      <div className="flex flex-col">
                        <div className="text-fill">{el}</div>
                        {/* <div className="bg-placeholder">{el.description}</div> */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end mt-[10vh]">
            <button
              disabled={isLoading}
              onClick={handlePurchase}
              className="btn btn-primary-large"
            >
              {isLoading ? (
                <CircularProgress color="inherit" className="!w-3 !h-3" />
              ) : (
                "PURCHASE"
              )}
            </button>
          </div>
        </div>
      </AlertDialog>
    </>
  );
};

export default PurchasePages;
