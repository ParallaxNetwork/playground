
import { ethers } from "ethers";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import axios from "axios";
import { Player, useCreateStream } from "@livepeer/react";
import { Zoom, CircularProgress } from "@mui/material";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { useAccount, useSigner, useNetwork } from "wagmi";


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

import { PGCORE_ABI } from "../../../utilities/PGCoreABI";
import { PGSUBS_ABI } from '../../../utilities/PGSubsABI';
import { contractConfig } from "../../../utilities/contractConfig";
import { uploadToIPFS } from "../../../utilities/ipfsUploader";

const ProfilePage = () => {
  const user = useUser();

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
  const [profileData, setProfileData] = useState({
    pfp: "/assets/picture/placeholder.png",
    bio: "",
    join_since: "",
  });

  const [salesAndWithdrawAble, setSalesAndWithdrawAble] = useState({
    wdable: 0.0,
    sales: 0.0,
  });
  const { setSigner, orbis, profile, setProfile } = useOrbis();
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

  const handleSaveProfile = async (formData) => {
    handleCloseDialog();
    ShowToast({
      message: "Uploading Profile",
    });
    const cid = await uploadToIPFS([formData.pfp.target.files[0]]);
    const fileName = formData.pfp.target.files[0].name;
    const pfp = `https://${cid}.ipfs.nftstorage.link/${fileName}`;

    setProfileData({
      ...formData,
      pfp: pfp,
      data: {
        name: formData.name,
        bio: formData.bio,
        join_since: "",
      },
    });

    let res = await orbis.updateProfile({
      ...formData,
      pfp: pfp,
      data: {
        name: formData.name,
        bio: formData.bio,
        join_since: "",
      },
    });
    getUserProfile();
  };

  const getUserProfile = async () => {
    if (address) {
      const { data: userDids, error: errorDids } = await orbis.getDids(address);
      if (!errorDids && userDids.length) {
        const { data: profileData, error: profileError } =
          await orbis.getProfile(userDids[0].did);

        if (!profileError) setProfileData(profileData.details.profile);
      }
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
      getUserProfile();
    }, 1);
  }, []);

  useEffect(() => {
    getUserProfile();
  }, [address]);

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

  const handleRenewKey = (keyID) => {
    console.log("RENEW", keyID);

    const contracts = new Contract(
      contractConfig.PGCORE_ADDRESS,
      PGCORE_ABI.abi,
      signer
    );
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
                      <CollectionImage
                        src={`${profileData?.pfp ?? "/assets/picture/placeholder.png"
                          }`}
                        className="max-w-[114px] h-[114px] w-full"
                      />
                      <div className="ml-5 lg:mt-[-9px] flex flex-row justify-start w-full  flex-wrap break-all">
                        <div className="max-w-full lg:pr-5">
                          <div className="subtitle">Name</div>
                          <div>{profileData?.name ?? "NOT SET"}</div>
                          <div className="subtitle lg:mt-5">Join Since</div>
                          <div>{"-"}</div>
                        </div>
                        <div className="max-w-full ml-0 lg:mt-0 lg:ml-5">
                          <div className="subtitle">Bio</div>
                          <div>{profileData?.bio ?? "NOT SET"}</div>
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
            )}
            {isEmpty(user.subscription) || isEmpty(address) ? (
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
              <>
                <ShadowBox className={"shadowBox mt-5"}>
                  <div className="flex flex-row shrink grow-0 bg-secondary text-white px-5 py-3 title-primary border-b-2 border-r-2 border-black max-w-[270px]">
                    MY SUBSCRIPTION
                  </div>
                  <div className="grid grid-rows-1 lg:grid-cols-4 xl:grid-cols-5 p-2 gap-3 m-4">
                    {user.subscription.map((el, index) => {
                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center border-2 border-black p-5 lg:p-2"
                        >
                          <CollectionImage
                            src={el.tokenURI.slice(0, el.tokenURI.length - 1)}
                            className="max-w-[222px] md:max-w-[413px] h-full "
                          />
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
                          <button onClick={() => handleRenewKey(el.id)} className="btn btn-primary-large mt-2 mb-3 h-[53px]">
                            RENEW
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </ShadowBox>

                <ShadowBox className={"shadowBox mt-5"}>
                  <div className="flex flex-row shrink grow-0 bg-secondary text-white px-5 py-3 title-primary border-b-2 border-r-2 border-black max-w-[270px]">
                    MY COLLECTION
                  </div>
                  <div className="grid grid-rows-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 p-2 gap-3 m-4">
                    {user.userCollection ?
                      <>
                        {user.userCollection.map((item, index) => {
                          return (
                            <div key={index} className="border border-black p-2">
                              <img src={item.image} alt="" className="w-full border border-black" />

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
                      <>
                        {[1, 2, 3, 4].map((item, index) => {
                          return (
                            <div key={index} className="w-full h-[16rem] bg-gray-200 animate-pulse rounded-md" />
                          )
                        })}
                      </>
                    }
                  </div>
                </ShadowBox>
              </>
            )}
          </LayoutContainer>
        ) : (
          <div></div>
        )}

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
    </Zoom>
  );
};

export default ProfilePage;
