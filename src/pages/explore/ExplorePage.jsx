import { Contract } from "@ethersproject/contracts";
import { Zoom } from "@mui/material";
import { InjectedConnector } from "@wagmi/core";
import { isEmpty } from "lodash";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  useClient,
  useNetwork,
} from "wagmi";

import { contractConfig } from "../../../utilities/contractConfig";
import { PGCORE_ABI } from "../../../utilities/PGCoreABI";
import CollectionImage from "../../components/elements/CollectionImage";
import LayoutContainer from "../../components/elements/Container";
import NoItems from "../../components/elements/NoItems";
import ShadowBox from "../../components/elements/ShadowBox";
import SvgIconStyle from "../../components/elements/SvgIconStyle";
import { lockMeta } from "./lockMeta";

import { useUser } from "../../context/UserContext"
import { useExplore } from "../../context/ExploreContext";

const IndexPage = () => {
  const user = useUser();

  const { exploreData } = useExplore()

  return (
    <Zoom in={true}>
      <div>
        <LayoutContainer>
          <div className="space-y-10 mb-10">
            {exploreData === null ? (
              <div className="w-full text-center space-y-10">
                {[1, 2].map((el, index) => {
                  return (
                    <ShadowBox key={index} className={"shadowBoxBtnSmall"}>
                      <div className="flex flex-row justify-between items-center bg-secondary text-white px-5 py-3 title-primary border-b-2 border-black">
                        <img src="/assets/icons/hearts-icon.svg" alt="" />
                      </div>

                      <div className="m-5 p-2 grid grid-cols-12">
                        <div className="col-span-12 md:col-span-5 lg:col-span-3 p-4">
                          <div className="w-full">
                            <div className="w-full max-w-[32rem] m-auto aspect-square rounded-md animate-pulse bg-gray-200" />
                          </div>
                        </div>

                        <div className="col-span-12 md:col-span-7 lg:col-span-9 p-4">
                          <div className="ml-0 mt-5 lg:ml-5 lg:mt-[-9px] flex flex-col justify-start w-full gap-3 flex-wrap">
                            <div className="max-w-full ">
                              <div className="w-[200px] h-5 animate-pulse bg-gray-200 mt-3"></div>
                            </div>
                            <div className="max-w-full ">
                              <div className="w-full h-5 animate-pulse bg-gray-200 mt-3"></div>
                            </div>
                            <div className="max-w-full ">
                              <div className="w-[200px] h-5 animate-pulse bg-gray-200 mt-3"></div>
                            </div>
                            <div className="max-w-full ">
                              <div className="w-full h-5 animate-pulse bg-gray-200 mt-3"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ShadowBox>
                  );
                })}
              </div>
            ) : isEmpty(exploreData) ? (
              <NoItems description="no idol registered at this time, come back later" />
            ) : (
              exploreData.map((el, index) => {
                const isSubscribed = user.isSubscribed(el.lockAddress)
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

                        <div className="flex flex-row items-center">
                          {isSubscribed &&
                            <div className="bg-white text-black text-sm mr-2 border border-black p-2 font-semibold">
                              Subscribed
                            </div>
                          }

                          <img src="/assets/icons/hearts-icon.svg" alt="" />
                        </div>
                      </div>

                      <div className="m-5 p-2 grid grid-cols-12">
                        <div className="col-span-12 md:col-span-5 lg:col-span-3 p-4">
                          <div className="w-full">
                            <CollectionImage
                              src={el.lockImage}
                              className="m-auto max-w-[32rem]"
                            />
                          </div>
                        </div>

                        <div className="col-span-12 md:col-span-7 lg:col-span-9 p-4">
                          <div className="ml-0 mt-5 flex flex-col justify-start w-full gap-0 xl:gap-8">
                            {/* Description */}
                            <div className="w-full">
                              <div className="subtitle">DESCRIPTION</div>
                              <div>{el.description}</div>
                              <div className="subtitle mt-4">Interest</div>
                              <div>{el.interest?.join() ?? "-"}</div>
                            </div>

                            {/* Perks */}
                            <div className="max-w-full mt-5">
                              <div className="flex flex-row space-x-3">
                                <img
                                  src="/assets/icons/verified-icon.svg"
                                  alt=""
                                />
                                <div className="subtitle">NFT PERKS</div>
                              </div>

                              <div className="mt-3 space-y-2">
                                {isEmpty(el.perks) ? (
                                  <></>
                                ) : (
                                  el.perks.map((child, i) => {
                                    return (
                                      <div
                                        key={i}
                                        className="flex flex-row items-center border-2 border-black"
                                      >
                                        <div className="border-r-2 border-black h-full p-3">
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
                                  })
                                )}
                              </div>
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
