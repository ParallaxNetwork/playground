import { WalletService } from "@unlock-protocol/unlock-js";
import { InjectedConnector } from "@wagmi/core";
import {
  useAccount,
  useClient,
  useConnect,
  useNetwork,
  useProvider,
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
import { ethers } from "ethers";
import { isEmpty } from "lodash";
import NoItems from "../../components/elements/NoItems";
import { CircularProgress, Zoom } from "@mui/material";
import { lockMeta } from "./lockMeta";
const IndexPage = () => {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { providers, provider, getProvider } = useClient();
  const { chain, chains } = useNetwork();
  const prov = useProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [idolData, setIdolData] = useState([
    // {
    //   title: "SINKA - JKT48",
    //   image: "/assets/picture/sample1.png",
    //   description:
    //     "Sinka Juliaah is a member of the Indonesian idol group JKT48.",
    //   interest: "Listening Music, Singing, Swimming",
    //   nftCollection: [],
    //   perks: [
    //     {
    //       icons: "/assets/icons/chat-icon.svg",
    //       value: "Group Chat",
    //     },
    //     {
    //       icons: "/assets/icons/private-icon.svg",
    //       value: "Private Chat",
    //     },
    //     {
    //       icons: "/assets/icons/live-icon.svg",
    //       value: "Exclusive Live Video Access",
    //     },
    //   ],
    // },
  ]);

  const fetchIdols = async () => {
    setIsLoading(true);
    const contracts = new Contract(
      contractConfig.PGCORE_ADDRESS,
      PGCORE_ABI.abi,
      providers.entries().next().value[1]
    );
    const result = await contracts.getAllIdolData(1, 10);
    let tempData = [];
    for (var i = 0; i < result.length; i++) {
      if (
        result[i].idolAddress != "0x0000000000000000000000000000000000000000"
      ) {
        var tempMeta = await lockMeta(chain, result[i].lockAddress);
        tempData.push({
          lockName: result[i].lockName,
          lockAddress: result[i].lockAddress,
          lockImage: result[i].lockImage,
          nftKeyAddress: result[i].nftKeyAddress,
          idolAddress: result[i].idolAddress,
          playbackID: tempMeta.stream_playbackId,
          streamID: tempMeta.stream_id,
          description: tempMeta.description,
          interest: tempMeta.interest,
          perks: tempMeta.perks,
        });
      }
    }
    console.log(tempData);
    setIdolData(tempData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchIdols();
  }, []);

  return (
    <Zoom in={true}>
      <div>
        <LayoutContainer>
          <div className="space-y-10 mb-10">
            {isLoading ? (
              <div className="w-full h-screen text-center">
                <CircularProgress color="inherit" className="m-auto" />
              </div>
            ) : isEmpty(idolData) ? (
              <NoItems description="no idol registered at this time, come back later" />
            ) : (
              idolData.map((el, index) => {
                return (
                  <ShadowBox key={index} className={"shadowBoxBtnSmall"}>
                    <Link
                      href={{
                        pathname: "/purchase",
                        query: {
                          nftAddress: el.nftKeyAddress,
                          lockAddress: el.lockAddress,
                        },
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
                        <div className="ml-0 mt-5 lg:ml-5 lg:mt-[-9px] flex flex-col lg:flex-row justify-start w-full gap-0 xl:gap-8 flex-wrap">
                          <div className="max-w-full ">
                            <div className="subtitle">DESCRIPTION</div>
                            <div>{el.description}</div>
                            <div className="subtitle mt-4">Interest</div>
                            <div>{el.interest?.join()}</div>
                          </div>
                          <div className="max-w-full mt-5 lg:mt-0">
                            <div className="flex flex-row space-x-3">
                              <img
                                src="/assets/icons/verified-icon.svg"
                                alt=""
                              />
                              <div className="subtitle">NFT PERKS</div>
                            </div>
                            <div className="mt-3 space-y-2">
                              {el.perks.map((child, i) => {
                                return (
                                  <div
                                    key={i}
                                    className="flex flex-row border-2 border-black"
                                  >
                                    <div className="border-r-2 border-black p-3">
                                      <SvgIconStyle
                                        src={"/assets/icons/star-icon.svg"}
                                        className="w-6 h-6 bg-highlight"
                                      />
                                    </div>
                                    <div className="block font-medium text-fill p-3">
                                      {child}
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
              })
            )}
          </div>
        </LayoutContainer>
      </div>
    </Zoom>
  );
};
export default IndexPage;
