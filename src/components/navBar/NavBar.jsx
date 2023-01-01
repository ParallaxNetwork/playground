import { Web3Provider } from "@ethersproject/providers";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import { Zoom } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { disconnect } from "@wagmi/core";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { generateNonce, SiweMessage } from "siwe";
import {
  useAccount,
  useConnect,
  useNetwork,
  useSignMessage,
  useSigner,
} from "wagmi";
import { shortAddress, didToAddress } from "../../../utilities/addressUtils";
import { useOrbis } from "../../context/OrbisContext";
import { LayoutTop } from "../elements/Container";
import SEO from "./SEO";
const NavBar = () => {
  const router = useRouter();
  const path = router.pathname;
  const {
    connect,
    connectAsync,
    connectors,
    isLoading,
    pendingConnector,
    isSuccess,
  } = useConnect();
  const { chain, chains } = useNetwork();
  const [openMiniDialog, setOpenMiniDialog] = useState(false);
  const { address, isConnected } = useAccount();
  const { signMessageAsync, onSuccess } = useSignMessage();
  const [showButton, setShowButton] = useState();
  const { data: signer } = useSigner();
  const [resprovider, setresprovider] = useState();
  const { connectOrbis, profile, checkOrbisConnection, disconnectOrbis } =
    useOrbis();
  useEffect(() => {
    if (isSuccess && isConnected) {
      handleSign(resprovider);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (address && !profile) {
      checkOrbisConnection(signer?.provider?.provider, true);
    } else if (address?.toLowerCase() !== didToAddress(profile?.did)) {
      disconnectOrbis();
    }
  }, [address, profile]);

  useEffect(() => {
    setTimeout(() => {
      setShowButton(true);
    }, 200);
  }, []);

  const route = [
    {
      loc: "/",
      label: "EXPLORE",
    },
    {
      loc: "/engage",
      label: "ENGAGE",
    },
    {
      loc: "/profile",
      label: "MY PROFILE",
    },
  ];

  const walletIcons = {
    metaMask: "/assets/icons/metaMask.svg",
    walletConnect: "/assets/icons/walletConnect.svg",
  };

  const handleSign = async () => {
    const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID);
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in with Ethereum to the app.",
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce: generateNonce(),
    });
    const signature = await signMessageAsync({
      message: message.prepareMessage(),
    }).catch(async (e) => {
      console.log(e);
      return await disconnect();
    });

    let data = JSON.stringify({
      message: message.toMessage(),
      signature: signature,
    });

    try {
      await connectOrbis(resprovider);
    } catch (e) {
      console.log(e);
      return await disconnect();
    }

    let config = {
      method: "post",
      url: "https://locksmith.unlock-protocol.com/v2/auth/login",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async (response) => {
        var resData = response.data;
        localStorage.setItem("accessToken", resData.accessToken);
        console.log(resData.accessToken);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <SEO />
      <LayoutTop>
        <div className="flex flex-row justify-between items-center w-full">
          <Link href={"/"}>
            <Image
              src={"/assets/picture/MainLogo.png"}
              width={228}
              height={60}
              alt="mainlogo"
              priority
            />
          </Link>
          <div className="hidden lg:flex flex-row justify-between w-full items-center ">
            <div className="flex flex-row space-x-10 ml-[8%] pt-0 h-[90px]">
              {route.map((el, index) => {
                return (
                  <Link
                    href={el.loc}
                    key={index}
                    className={`font-medium px-1 ${
                      path == el.loc
                        ? "highlight"
                        : path.includes(el.loc) && el.loc != "/"
                        ? "highlight"
                        : "bg-placeholder"
                    }`}
                  >
                    <div className="mt-9">{el.label}</div>
                  </Link>
                );
              })}
            </div>

            <ClickAwayListener onClickAway={() => setOpenMiniDialog(false)}>
              <div className="relative">
                <button
                  onClick={async () => {
                    if (isConnected) {
                      return await disconnect();
                    }
                    setOpenMiniDialog(true);
                  }}
                  className="btn btn-primary-large"
                >
                  {showButton ? (
                    address ? (
                      shortAddress(address)
                    ) : (
                      "CONNECT WALLET"
                    )
                  ) : (
                    <CircularProgress
                      color="inherit"
                      className="!w-5 !h-5 mt-1"
                    />
                  )}
                </button>

                <Zoom in={openMiniDialog}>
                  <div className="shadowBox absolute border-2 border-black bg-white rounded-md top-[55px] z-10">
                    {connectors.map((connector) => (
                      <button
                        // disabled={!connector.ready}
                        key={connector.id}
                        onClick={async () => {
                          setOpenMiniDialog(false);
                          const res = await connectAsync({
                            connector,
                            chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID),
                          });
                          setresprovider(res.provider);

                          //connect({ connector });
                        }}
                        className="flex flex-row p-2 items-center gap-2"
                      >
                        <img
                          src={walletIcons[connector.id]}
                          className="w-7 h-7 rounded-md"
                        />
                        {connector.name}
                        {isLoading &&
                          pendingConnector?.id === connector.id &&
                          " (connecting)"}
                      </button>
                    ))}
                  </div>
                </Zoom>
              </div>
            </ClickAwayListener>
          </div>
        </div>
        <hr className="border-[1px] border-[#DAE1E9] mt-4 lg:mt-0" />
      </LayoutTop>
    </>
  );
};

export default NavBar;
