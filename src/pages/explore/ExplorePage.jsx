import { WalletService } from "@unlock-protocol/unlock-js";
import { InjectedConnector } from "@wagmi/core";
import {
  useAccount,
  useClient,
  useConnect,
  useNetwork,
  useSigner,
  useSignMessage,
} from "wagmi";
import LayoutContainer from "../../components/elements/Container";
import CollectionImage from "../../components/elements/CollectionImage";
import ShadowBox from "../../components/elements/ShadowBox";
import Link from "next/link";
import SvgIconStyle from "../../components/elements/SvgIconStyle";
import { useEffect, useState } from "react";
import { contractConfig } from "../../../utilities/contractConfig";
import { PGCORE_ABI } from "../../../utilities/PGCoreABI";
import { Contract } from "@ethersproject/contracts";
const IndexPage = () => {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { provider } = useClient();
  const { chain, chains } = useNetwork();
  const [idolData, setIdolData] = useState([
    {
      title: "SINKA - JKT48",
      image: "/assets/picture/sample1.png",
      description:
        "Sinka Juliaah is a member of the Indonesian idol group JKT48.",
      interest: "Listening Music, Singing, Swimming",
      nftCollection: [],
      perks: [
        {
          icons: "/assets/icons/chat-icon.svg",
          value: "Group Chat",
        },
        {
          icons: "/assets/icons/private-icon.svg",
          value: "Private Chat",
        },
        {
          icons: "/assets/icons/live-icon.svg",
          value: "Exclusive Live Video Access",
        },
      ],
    },
  ]);

  const fetchIdols = async () => {
    const contracts = new Contract(
      contractConfig.PGCORE_ADDRESS,
      PGCORE_ABI.abi,
      signer
    );
    const result = await contracts.getAllIdolData(1, 10);
    let tempData = [];
    for (var data of result) {
      if (data.idolAddress != "0x0000000000000000000000000000000000000000") {
        tempData.push(data);
      }
    }
    
    setIdolData(tempData);
  };

  useEffect(() => {
    if (signer) {
      fetchIdols();
    }
  }, []);

  return (
    <>
      <LayoutContainer>
        <div className="space-y-10 mb-10">
          {idolData.map((el, index) => {
            return (
              <ShadowBox key={index} className={"shadowBoxBtnSmall"}>
                <Link
                  href={{
                    pathname: "/purchase",
                  }}
                >
                  <div className="flex flex-row justify-between items-center bg-secondary text-white px-5 py-3 title-primary border-b-2 border-black">
                    {el.lockName}
                    <img src="/assets/icons/hearts-icon.svg" alt="" />
                  </div>
                  <div className="flex m-5 flex-col lg:flex-row p-2">
                    <CollectionImage
                      src={el.lockImage}
                      className="aspect-[1/1] max-w-[340px] w-full"
                    />
                    <div className="ml-0 mt-5 lg:ml-5 lg:mt-[-9px] flex flex-col lg:flex-row justify-start w-full gap-0 xl:gap-8">
                      <div className="max-w-full ">
                        <div className="subtitle">DESCRIPTION</div>
                        <div>{el.description}</div>
                        <div className="subtitle mt-4">Interest</div>
                        <div>{el.interest}</div>
                        <div className="subtitle mt-4">NFT Collection</div>
                      </div>
                      <div className="max-w-full mt-5 lg:mt-0">
                        <div className="flex flex-row space-x-3">
                          <img src="/assets/icons/verified-icon.svg" alt="" />
                          <div className="subtitle">NFT PERKS</div>
                        </div>
                        <div className="mt-3 space-y-2">
                          {[
                            {
                              icons: "/assets/icons/chat-icon.svg",
                              value: "Group Chat",
                            },
                            {
                              icons: "/assets/icons/private-icon.svg",
                              value: "Private Chat",
                            },
                            {
                              icons: "/assets/icons/live-icon.svg",
                              value: "Exclusive Live Video Access",
                            },
                          ].map((child, i) => {
                            return (
                              <div
                                key={i}
                                className="flex flex-row border-2 border-black"
                              >
                                <div className="border-r-2 border-black p-3">
                                  <SvgIconStyle
                                    src={child.icons}
                                    className="w-6 h-6 bg-highlight"
                                  />
                                </div>
                                <div className="block font-medium text-fill p-3">
                                  {child.value}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </ShadowBox>
            );
          })}
        </div>
      </LayoutContainer>
    </>
  );
};
export default IndexPage;
