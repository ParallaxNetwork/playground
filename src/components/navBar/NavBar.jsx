import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useConnect, useNetwork } from "wagmi";
import { generateNonce, SiweMessage } from "siwe";
export const NavBar = () => {
  const router = useRouter();
  const [path, setPath] = useState("");
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { chain, chains } = useNetwork();
  useEffect(() => {
    setPath(router.pathname);
  }, [router]);

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
      <div className="flex flex-col w-full px-[45px] pt-[20px] ">
        <div className="flex flex-row justify-between items-center w-full">
          <img src={"/assets/picture/MainLogo.svg"} />
          <div className="hidden lg:flex flex-row justify-between w-full items-center ">
            <div className="flex flex-row space-x-10 ml-[8%] pt-0 h-[90px]">
              {route.map((el, index) => {
                return (
                  <Link
                    href={el.loc}
                    key={index}
                    className={`font-medium f-16-px px-2 ${
                      path == el.loc
                        ? "highlight"
                        : path.includes(el.loc) && el.loc != "/"
                        ? "highlight"
                        : "non-highlight"
                    }`}
                  >
                    <div className="mt-9">{el.label}</div>
                  </Link>
                );
              })}
            </div>
            {/* {connectors.map((connector) => (
              <button
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => connect({ connector })}
              >
                {connector.name}
                {isLoading &&
                  pendingConnector?.id === connector.id &&
                  " (connecting)"}
                <div className="rounded-full overflow-hidden">
                  <img src={walletIcons[connector.id]} className="w-10 h-10" />
                </div>
              </button>
            ))} */}

            <button onClick={() => handleSign()} className="btn btn-large">
              CONNECT WALLET
            </button>
          </div>
        </div>
        <hr className="border-[1px] bg-[#DAE1E9] mt-4 lg:mt-0" />
      </div>
    </>
  );
};
