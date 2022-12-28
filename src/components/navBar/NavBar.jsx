import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";
import { generateNonce, SiweMessage } from "siwe";
import { LayoutTop } from "../elements/Container";
import Image from "next/image";
import SEO from "./SEO";
import { Zoom } from "@mui/material";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import axios from "axios";
import { shortAddress } from "../../../utilities/addressUtils";
import CircularProgress from "@mui/material/CircularProgress";
import { disconnect } from "@wagmi/core";
const NavBar = () => {
  const router = useRouter();
  const path = router.pathname;
  const { connect, connectors, isLoading, pendingConnector, isSuccess } =
    useConnect();
  const { chain, chains } = useNetwork();
  const [openMiniDialog, setOpenMiniDialog] = useState(false);
  const { address, isConnected } = useAccount();
  const { signMessageAsync, onSuccess } = useSignMessage();
  const [showButton, setShowButton] = useState();
  useEffect(() => {
    if (isSuccess && isConnected) {
      handleSign();
    }
  }, [isSuccess]);

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
    const chainId = chain.id;
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
    }).catch((e) => console.log(e));

    let data = JSON.stringify({
      message: message.toMessage(),
      signature: signature,
    });

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
      .then((response) => {
        console.log(JSON.stringify(response.data));
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
                        onClick={() => {
                          setOpenMiniDialog(false);
                          connect({ connector });
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
