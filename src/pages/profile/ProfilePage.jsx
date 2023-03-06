
import { ethers } from "ethers";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import axios from "axios";
import { Player, useCreateStream } from "@livepeer/react";
import { Zoom, CircularProgress } from "@mui/material";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { useAccount, useSigner, useNetwork } from "wagmi";
import { WalletService } from "@unlock-protocol/unlock-js";

import LayoutContainer from "../../components/elements/Container";
import ShadowBox from "../../components/elements/ShadowBox";
import CollectionImage from "../../components/elements/CollectionImage";
import SvgIconStyle from "../../components/elements/SvgIconStyle";
import NoItems from "../../components/elements/NoItems";
import { ShowToast } from "../../components/elements/Toaster";

import EditProfileDialog from "./EditProfileDialog";
import RegisterDialog from "./RegisterDIalog";

import { useOrbis } from "../../context/OrbisContext";
import { useUser } from "../../context/UserContext";
import { useUnlock } from "../../context/UnlockContext";

import { PGCORE_ABI } from "../../../utilities/PGCoreABI";
import { contractConfig } from "../../../utilities/contractConfig";
import { uploadToIPFS } from "../../../utilities/ipfsUploader";
import { removeNumberPostfix, sleep } from "../../../utilities/misc";

const ProfilePage = () => {
  const user = useUser();
  const unlock = useUnlock();
  const { setSigner, orbis, profile, refetchProfile, checkOrbisConnection } = useOrbis();

  const [streamName, setStreamName] = useState("Stream");
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const { data: signer, isError } = useSigner();
  const { address, isConnected } = useAccount();
  const { chain, chains } = useNetwork();
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [idolData, setIdolData] = useState();
  const [streamID, setStreamID] = useState();
  const [playbackID, setPlaybackID] = useState();
  const [streamKey, setStreamKey] = useState();
  const [isDoneDeploy, setIsDoneDeploy] = useState(false);
  const [registerData, setRegisterData] = useState();

  const [salesAndWithdrawAble, setSalesAndWithdrawAble] = useState({
    wdable: 0.0,
    sales: 0.0,
  });

  let web3;
  const [initEverything, setInitEverything] = useState(false);
  const {
    mutate: createStream,
    data: streamData,
    status,
  } = useCreateStream(streamName ? { name: streamName } : null);

  const handleCloseDialog = () => {
    setOpenEditProfile(false);
  };

  const handleCloseRegisterDialog = () => {
    setOpenRegisterDialog(false);
  };

  const handleSaveProfile = async (formData, pfpFile) => {
    try {
      handleCloseDialog();
      ShowToast({
        message: "Uploading Profile",
        state: "loading",
        duration: 8000,
        id: "profile-update"
      });

      console.log("orbisconnection", await orbis.isConnected())

      if (!pfpFile) {
        console.log("no pfp change")
        let res = await orbis.updateProfile(formData);
      } else {
        ShowToast({
          message: "Uploading Profile Picture",
          state: "loading",
          id: "profile-update",
          duration: 5000
        });

        const cid = await uploadToIPFS([pfpFile]);
        const fileName = formData.pfpFile.name;
        const pfp = `https://${cid}.ipfs.nftstorage.link/${fileName}`;

        let res = await orbis.updateProfile({
          ...formData,
          pfp: pfp,
        });
      }

      await sleep(1500)
      await refetchProfile()

      ShowToast({
        message: "Profile Updated",
        state: "success",
        id: "profile-update"
      });
    } catch (error) {
      console.log(error);
    }
  };

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
      description,
      interest,
    } = data;
    setRegisterData(data);
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

      setIsLoadingSubscription(true);
      ShowToast({
        message: "Working on it~",
      });
      setTimeout(() => {
        ShowToast({
          message: "Waiting for confirmation..",
        });
      }, 2000);
      const receipt = await transactionResponse.wait();
      if (receipt.status == 1) {
        ShowToast({
          message: "Subscription Created!",
        });
        await getIdolData();
        setIsDoneDeploy(true);
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
    return new Promise(async (resolve) => {
      try {
        setIsLoadingSubscription(true);
        const contracts = new Contract(
          contractConfig.PGCORE_ADDRESS,
          PGCORE_ABI.abi,
          signer
        );
        const result = await contracts.getSingleIdolData(address);
        setStreamName(result.lockName);
        setIsLoadingSubscription(false);
        if (
          result.lockAddress == "0x0000000000000000000000000000000000000000"
        ) {
          setIdolData(null);
        } else {
          setIdolData(result);
          getMetaData(result);
          getSalesAndWithdrawAble(result);
        }

        return resolve(result);
      } catch (e) {
        console.log(e);
        setIsLoadingSubscription(false);
      }
    });
  };

  const handleCreateStream = async () => {
    return new Promise((resolve) => {
      ShowToast({
        message: "Creating streaming channel for you..",
      });
      createStream?.();
      resolve();
    });
  };

  const getMetaData = (result) => {
    let data = {};
    let config = {
      method: "GET",
      url: `https://locksmith.unlock-protocol.com/v2/api/metadata/${chain.id}/locks/${result.lockAddress}`,

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: data,
    };

    axios(config).then(async (response) => {
      fetchStreamDetails(response.data.stream_id);
    });
  };

  const fetchStreamDetails = async (id) => {
    var data = {
      streamId: id,
    };
    let config = {
      method: "POST",
      url: `/api/getstreamkey`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: JSON.stringify(data),
    };

    axios(config).then(async (response) => {
      setStreamKey(response.data.streamKey);
      setStreamID(response.data.id);
      setPlaybackID(response.data.playbackId);
    });
  };

  const handleUpdateMetaData = async () => {
    if (!streamData) {
      return console.log("null streamdata");
    }
    ShowToast({
      message: "Updating Metadata..",
    });

    let data = JSON.stringify({
      metadata: {
        stream_playbackId: streamData.playbackId,
        stream_name: streamData.name,
        stream_id: streamData.id,
        stream_url: streamData.playbackUrl,
        lockAddress: idolData.lockAddress,
        idolAddress: idolData.idolAddress,
        description: registerData.description,
        price: ethers.utils.parseUnits(registerData.price, "ether"),
        collectionImageURI: registerData.collectionImageURI,
        nftImageURI: registerData.nftImageURI,
        interest: registerData.interest,
        duration: registerData.duration,
        perks: [
          `Group Chat ${registerData.duration / 86400} days`,
          "Private Chat",
          "Exclusive Live Video Access",
        ],
      },
    });
    let config = {
      method: "put",
      //  url: `https://locksmith.unlock-protocol.com/v2/api/metadata/${chain.id}/users`,
      url: `https://locksmith.unlock-protocol.com/v2/api/metadata/${chain.id}/locks/${idolData.lockAddress}`,

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: data,
    };

    axios(config)
      .then(async (response) => {
        var resData = response.data;
        console.log(resData);
        ShowToast({
          message: "Stream Channel Created",
        });
        getIdolData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (window) {
      web3 = new Web3Provider(window.ethereum);
    }
    if (signer && address) {
      setSigner(signer);
      getIdolData();
    }
  }, [signer]);

  useEffect(() => {
    setTimeout(() => {
      user.getSubscription();
      setInitEverything(true);
    }, 1);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (streamData || status) {
        handleUpdateMetaData();
      }
    }, 1000);
  }, [streamData, status]);

  useEffect(() => {
    if (isDoneDeploy) {
      handleCreateStream();
    }
  }, [isDoneDeploy]);

  const handleInitWithdraw = async () => {
    const contracts = new Contract(
      contractConfig.PGCORE_ADDRESS,
      PGCORE_ABI.abi,
      signer
    );
    let transactionResponse;
    try {
      ShowToast({
        message: "Request for Withdraw Initialization",
      });
      transactionResponse = await contracts.initWithdraw();
      setTimeout(() => {
        ShowToast({
          message: "This might take a while",
        });
      }, 2000);
      const receipt = await transactionResponse.wait();
      if (receipt.status == 1) {
        getSalesAndWithdrawAble(idolData);
        ShowToast({
          message: "Withdraw Initialized! now you can proceed to withdrawable button",
        });
      }
    } catch (e) {
      console.log(e);
      getSalesAndWithdrawAble(idolData);
      ShowToast({
        message: "Something went wrong :(",
        state: "error",
      });
    }
  };

  const getSalesAndWithdrawAble = async (data) => {
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    const salesbalance = await _provider.getBalance(data.lockAddress);
    const sales = ethers.utils.formatEther(salesbalance);

    const wdable = ethers.utils.formatEther(data.balance);

    setSalesAndWithdrawAble({
      wdable: wdable,
      sales: sales,
    });
  };

  const handleWithdraw = async () => {
    ShowToast({
      message: "Now requesting for withdrawal~",
    });
    const contracts = new Contract(
      contractConfig.PGCORE_ADDRESS,
      PGCORE_ABI.abi,
      signer
    );
    let transactionResponse;
    try {
      transactionResponse = await contracts.withdrawSales();
      setTimeout(() => {
        ShowToast({
          message: "Transaction submitted~ let's wait for a response",
        });
      }, 2000);
      const receipt = await transactionResponse.wait();
      if (receipt.status == 1) {
        getSalesAndWithdrawAble(idolData);
        ShowToast({
          message: "Withdraw Success!",
        });
      }
    } catch (e) {
      ShowToast({
        message: "Failed to withdraw",
        state: "error",
      });
      console.log("failed to withdraw");
    }
  };

  const [isLoadingRenew, setIsLoadingRenew] = useState(false);

  const handleRenewKey = async (keyDetail) => {
    console.log(keyDetail);
    const tokenId = keyDetail.tokenId;
    const lockAddress = keyDetail.lock.address;

    setIsLoadingRenew(true);
    await unlock.handleExtendKey(lockAddress, tokenId);
    setIsLoadingRenew(false);

    await user.getSubscription();
  };

  return (
    <Zoom in={true}>
      <div>
        {initEverything ? (
          <LayoutContainer className={"pb-10"}>
            {isEmpty(address) ? (
              ""
            ) : (
              <>
                <ShadowBox className={"shadowBox"}>
                  <div className="relative">
                    <div className="flex flex-row justify-between">
                      <div className="items-center bg-secondary text-white px-5 py-3 title-primary border-b-2 border-r-2 border-black max-w-[230px] flex flex-row">
                        <img
                          alt=""
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
                      {/* <CollectionImage
                        src={`${profile?.details?.profile?.pfp ?? "/assets/picture/placeholder.png"
                          }`}
                        className="max-w-[114px] h-[114px] w-full"
                      /> */}

                      {/* {JSON.stringify(profile)} */}
                      <div className="aspect-square w-full max-w-[12rem] max-h-[12rem] ring-2 ring-black flex items-center justify-center">
                        <img src={`${profile?.details?.profile?.pfp ?? "/assets/picture/placeholder.png"}`} alt="" className="max-w-full max-h-full" />
                      </div>

                      {/* Profile data */}
                      <div className="ml-5 lg:mt-[-9px] w-full max-w-[30rem]">
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-12 md:col-span-6">
                            <div className="subtitle">Name</div>
                            <div>{profile?.username ?? "NOT SET"}</div>
                          </div>

                          <div className="col-span-12 md:col-span-6">
                            <div className="subtitle">Bio</div>
                            <div>{profile?.details?.profile?.description ?? "NOT SET"}</div>
                          </div>
                        </div>

                        {/* <div className="grid-cols-12 gap-4 mt-2 md:mt-0">
                          <div className="col-span-12 md:col-span-6">
                            <div className="subtitle">Joined since:</div>
                            <div>{profile?.name ?? "NOT SET"}</div>
                          </div>
                        </div> */}
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
                      {idolData ? (
                        <div className="flex flex-col items-start gap-5 w-full">
                          <div className="flex flex-col break-all gap-5">
                            <div>
                              <div className="subtitle">{`Subscription & Stream Name`}</div>
                              <div>{idolData.lockName}</div>
                            </div>
                            <div>
                              <div className="subtitle">{`Public Lock Protocol Address`}</div>
                              <div>{idolData.lockAddress}</div>
                            </div>
                            <div>
                              <div className="subtitle">{`Latest Subscription & NFT Address`}</div>
                              <div>{idolData.nftKeyAddress}</div>
                            </div>
                          </div>
                          <div className="flex-col items-start justify-start space-y-0 w-full shadowBox mt-3">
                            <div className="flex flex-row shrink grow-0 bg-secondary text-white px-5 py-3 title-primary border-b-2 border-r-2 border-black">
                              STREAM CONFIG
                            </div>
                            <div className="p-4 gap-3 flex flex-col pb-8">
                              <div>
                                <div className="subtitle">{`Stream ID`}</div>
                                <div>
                                  {streamID ?? (
                                    <div className="h-6 w-full max-w-[300px] bg-gray-200 animate-pulse"></div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="subtitle">{`Playback ID`}</div>
                                <div>
                                  {playbackID ?? (
                                    <div className="h-6 w-full max-w-[300px] bg-gray-200 animate-pulse"></div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="subtitle">{`Stream Key`}</div>
                                <div>
                                  {streamKey ?? (
                                    <div className="h-6 w-full max-w-[300px] bg-gray-200 animate-pulse"></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-col items-start justify-start space-y-4 w-full shadowBox">
                            <div className="flex flex-row shrink grow-0 bg-secondary text-white px-5 py-3 title-primary border-b-2 border-r-2 border-black">
                              SALES
                            </div>
                            <div className="px-4 max-w-[1000px]">
                              initialize your withdraw request by tapping on the
                              total button then proceed to withdrawable button
                              after confirmation
                            </div>
                            <div className="flex p-4 gap-10 flex-wrap pb-8 mt-0">
                              <div>
                                <div className="subtitle">{`Total`}</div>
                                <div
                                  onClick={() => handleInitWithdraw()}
                                  className="p-3 rounded-lg shadowBoxBtnSmall mt-2 flex flex-row items-center justify-between"
                                >
                                  <div>{salesAndWithdrawAble.sales} MATIC</div>
                                </div>
                              </div>
                              <div>
                                <div className="subtitle">{`Withdrawable`}</div>
                                <div
                                  onClick={() => handleWithdraw()}
                                  className="p-3 rounded-lg shadowBoxBtnSmall mt-2 flex flex-row items-center justify-between"
                                >
                                  <div>{salesAndWithdrawAble.wdable} MATIC</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="lg:mt-[-9px] flex flex-col justify-center w-full text-center max-w-lg m-auto flex-wrap break-all p-4">
                          <div>
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
                      )}
                    </div>
                  </div>
                </ShadowBox>
              </>
            )
            }
            {
              isEmpty(user.subscription) || isEmpty(address) ? (
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
                  <div className="flex flex-row shrink grow-0 bg-secondary text-white px-5 py-3 title-primary border-b-2 border-r-2 border-black max-w-[270px]">
                    MY SUBSCRIPTION
                  </div>
                  <div className="grid grid-cols-12 p-2 gap-3 m-4">
                    {user.subscription.map((el, index) => {
                      return (
                        <div key={index} className="col-span-12 md:col-span-6 lg:col-span-3 xl:col-span-2">
                          <div
                            className="flex flex-col items-center border-2 border-black p-5 lg:p-2"
                          >
                            <div className="flex justify-center items-center w-full h-[14rem] mt-4">
                              <CollectionImage
                                src={removeNumberPostfix(el.tokenURI)}
                                className="h-full"
                              />
                            </div>

                            <div className="flex gap-2 mt-5 subtitle items-center truncate justify-start">
                              <SvgIconStyle
                                src={"/assets/icons/verified-icon.svg"}
                                className="w-[18px] h-[30px] aspect-square bg-red mr-1"
                              />
                              {el.lock.name}
                            </div>

                            <div className="flex flex-wrap f-12-px text-center mt-3">
                              Playground Subscription
                            </div>
                            <div className="f-12-px bg-description mt-5 text-center">
                              {`Expired at ${new Date(
                                el.expiration * 1000
                              ).getDate()} ${new Date(
                                el.expiration * 1000
                              ).toLocaleString("default", {
                                month: "short",
                              })} ${new Date(el.expiration * 1000).getFullYear()}`}
                            </div>
                            <button onClick={() => handleRenewKey(el)} className="btn btn-primary-large mt-2 mb-3 h-[53px]">
                              RENEW
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ShadowBox>
              )
            }

            {
              isConnected &&
              <ShadowBox className={"shadowBox mt-5"}>
                <div className="flex flex-row shrink grow-0 bg-secondary text-white px-5 py-3 title-primary border-b-2 border-r-2 border-black max-w-[270px]">
                  MY COLLECTION
                </div>
                <div className="grid grid-cols-12 p-2 gap-3 m-4">
                  {user.userCollection ?
                    <>
                      {user.userCollection.length > 0 ?
                        <>
                          {user.userCollection.map((item, index) => {
                            return (
                              <div key={index} className="border border-black p-2 col-span-12 md:col-span-6 lg:col-span-3 xl:col-span-2">
                                <div className="flex justify-center items-center w-full h-[12rem] mt-4 mb-5">
                                  <img src={item.image} alt="" className="h-full border border-black" />
                                </div>

                                <div className="subtitle mt-2">
                                  {item.name}
                                </div>
                                <div className="text-sm">
                                  {item.description}
                                </div>
                              </div>
                            )
                          })}
                        </>
                        :
                        <div className={` ${isEmpty(address) ? "" : "mt-10 mb-10 w-full col-span-12"}`}>
                          <NoItems
                            isFullPage={isEmpty(address) ? true : false}
                            isFullWidth={isEmpty(address) ? false : true}
                            shadowBox={false}
                            description={
                              address
                                ? "You don't have any collection right now, Buy NFT to engage with your idol"
                                : "You are not connected 💔 please login using your wallet "
                            }
                          />
                        </div>
                      }
                    </>
                    :
                    <>
                      {[1, 2, 3, 4].map((item, index) => {
                        return (
                          <div key={index} className="w-full h-[16rem] bg-gray-200 animate-pulse rounded-md col-span-12 md:col-span-6 lg:col-span-3 xl:col-span-2" />
                        )
                      })}
                    </>
                  }
                </div>
              </ShadowBox>
            }
          </LayoutContainer >
        ) : (
          <div></div>
        )}

        <EditProfileDialog
          profile={profile}
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
      </div >
    </Zoom >
  );
};

export default ProfilePage;
