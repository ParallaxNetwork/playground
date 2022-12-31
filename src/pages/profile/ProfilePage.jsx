import LayoutContainer from "../../components/elements/Container";
import ShadowBox from "../../components/elements/ShadowBox";
import CollectionImage from "../../components/elements/CollectionImage";
import SvgIconStyle from "../../components/elements/SvgIconStyle";
import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import NoItems from "../../components/elements/NoItems";
import { useAccount, useSigner, useNetwork } from "wagmi";
import { ShowToast } from "../../components/elements/Toaster";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { PGCORE_ABI } from "../../../utilities/PGCoreABI";
import EditProfileDialog from "./EditProfileDialog";
import RegisterDialog from "./RegisterDIalog";
import { contractConfig } from "../../../utilities/contractConfig";
import { ethers } from "ethers";
import { CircularProgress } from "@mui/material";
import { Player, useCreateStream } from "@livepeer/react";
import axios from "axios";
import { useOrbis } from "../../context/OrbisContext";
import { Zoom } from "@mui/material";
const ProfilePage = () => {
  const [streamName, setStreamName] = useState("Stream");
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const { data: signer, isError } = useSigner();
  const { address, isConnected } = useAccount();
  const { chain, chains } = useNetwork();
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [idolData, setIdolData] = useState();
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

  const handleSaveProfile = () => {
    // setFormData({
    //   ...formData,
    //   pfp: nft.media[0]?.gateway || nft.media[0]?.raw,
    //   pfpIsNft: {
    //     chain: 'ethereum',
    //     contract: nft.contract.address,
    //     tokenId: nft.tokenId,
    //     timestamp: Math.floor(Date.now() / 1000).toString()
    //   }
    // })
    //    let res = await orbis.updateProfile(formData)
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

        setTimeout(async () => {
          await handleCreateStream();
        }, 2000);
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
      setStreamName(result.lockName);
      setIsLoadingSubscription(false);
      if (result.lockAddress == "0x0000000000000000000000000000000000000000") {
        setIdolData(null);
      } else {
        setIdolData(result);
        getSalesAndWithdrawAble(result);
      }

      return result;
    } catch (e) {
      console.log(e);
      setIsLoadingSubscription(false);
    }
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
        stream_url: streamData.playbackUrl,
        lockAddress: idolData.lockAddress,
        userAddress: idolData.idolAddress,
      },
    });
    let config = {
      method: "post",
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
        const contracts = new Contract(
          contractConfig.PGCORE_ADDRESS,
          PGCORE_ABI.abi,
          signer
        );
        let transactionResponse;
        try {
          handleCloseRegisterDialog();
          transactionResponse = await contracts.updatePlaybackID(
            streamData.playbackId
          );
          setIsLoadingSubscription(true);
          ShowToast({
            message: "Updating Stream Channel",
          });
          const receipt = await transactionResponse.wait();
          if (receipt.status == 1) {
            ShowToast({
              msg: "Stream Channel Created",
            });
          }
        } catch (e) {
          console.log(e);
        }
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
      setInitEverything(true);
    }, 1);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      handleUpdateMetaData();
    }, 2000);
  }, [streamData]);

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
        ShowToast({
          message: "Withdraw Initialized!",
        });
        getSalesAndWithdrawAble(idolData);
      }
    } catch (e) {
      console.log(e);
      ShowToast({
        message: "Something went wrong :(",
        state : 'error'
      });
      getSalesAndWithdrawAble(idolData);
    }
  };

  const getSalesAndWithdrawAble = async (data) => {
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    const salesbalance = await _provider.getBalance(data.lockAddress);
    const sales = ethers.utils.formatEther(salesbalance);

    const wdable = ethers.utils.formatEther(data.balance);

    console.log(wdable, sales);
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

  const nftCollection = [
    // {
    //   title: "Sinka's NFT",
    //   image: "/assets/picture/sample1.png",
    //   description: "asdasdasdasdasdasdasdsad",
    //   expired: "5 January 2024",
    // },
  ];

  return (
    <Zoom in={true}>
      <div>
        {initEverything ? (
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

                      {idolData ? (
                        <div className="flex flex-col items-start gap-4 w-full">
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
                          <div className="flex-col items-start justify-start space-y-4 w-full">
                            <div>
                              <div className="subtitle">{`Sales`}</div>
                              <div
                                onClick={() => handleInitWithdraw()}
                                className="px-2 py-1 rounded-lg shadowBoxBtnSmall mt-2 flex flex-row items-center justify-between"
                              >
                                <div>{salesAndWithdrawAble.sales} MATIC</div>
                                <div>
                                  <button className="title-secondary color-pink bg-transparent rounded-md ">
                                    <div className="p-2 m-auto">INITIALIZE</div>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="subtitle">{`Withdrawable`}</div>
                              <div
                                onClick={() => handleWithdraw()}
                                className="px-2 py-1 rounded-lg shadowBoxBtnSmall mt-2 flex flex-row items-center justify-between"
                              >
                                <div>{salesAndWithdrawAble.wdable} MATIC</div>
                                <div>
                                  <button className="title-secondary color-pink rounded-md ">
                                    <div className="p-2 m-auto">WITHDRAW</div>
                                  </button>
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
