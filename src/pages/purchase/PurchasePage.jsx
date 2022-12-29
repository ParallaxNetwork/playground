import LayoutContainer from "../../components/elements/Container";
import ShadowBox from "../../components/elements/ShadowBox";
import CollectionImage from "../../components/elements/CollectionImage";
import SvgIconStyle from "../../components/elements/SvgIconStyle";
import { Zoom } from "@mui/material";
import { useState } from "react";
const PurchasePages = () => {
  const perks = [
    "• Group Chat",
    "• Private Chat",
    "• Exclusive Live Video Access",
  ];

  return (
    <LayoutContainer>
      <ShadowBox className={"shadowBox "}>
        <div className="flex flex-row justify-between items-center bg-secondary text-white px-5 py-3 title-primary border-b-2 border-black">
          {"SINKA - JKT 48 #128"}
          <img src="/assets/icons/hearts-icon.svg" alt="" />
        </div>
        <div className="p-7">
          <div className="flex flex-col lg:flex-row">
            <CollectionImage
              src={"/assets/picture/sample1.png"}
              className="aspect-[1/1] max-w-[296px] w-full"
            />
            <div className="ml-0 mt-5 lg:ml-5 lg:mt-[-9px] flex flex-col lg:flex-row justify-start w-full">
              <div className="max-w-full lg:pr-5">
                <div className="subtitle">Proflie</div>
                <div>
                  {
                    "Sinka Juliaah is a member of the Indonesian idol group JKT48. "
                  }
                </div>
                <div className="subtitle mt-4">Interest</div>
                <div>{"Listening Music, Singing, Swimming"}</div>
                <div className="subtitle mt-4">Bio</div>
                <div>{"Listening Music, Singing, Swimming"}</div>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <Zoom in={true}>
              <div
                className={`flex flex-col lg:flex-row border-2 border-black p-3  w-full`}
              >
                <CollectionImage
                  src={"/assets/picture/sample3.png"}
                  className="max-w-[136px] w-full max-h-[181px] aspect-[1/3] m-auto mt-5 mb-5 lg:m-0"
                />
                <div className="ml-0 lg:ml-5 mt-3 lg:mt-0 flex flex-col lg:flex-row justify-between">
                  <div className="max-w-full w-full lg:w-1/3 ">
                    <div className="title-primary">SINKA 123</div>
                    <div className="subtitle">0.2 MATIC</div>
                    <div className="subtitle mt-5">DESCRIPTION</div>
                    <div>
                      Sinka Juliaah is a member of the Indonesian idol group
                      JKT48.
                    </div>
                  </div>
                  <div className="max-w-full w-full lg:w-1/3 ml-0 mt-5 lg:mt-0 lg:ml-5 justify-center flex flex-col">
                    <div className="flex flex-row space-x-3">
                      <img src="/assets/icons/verified-icon.svg" alt="" />
                      <div className="subtitle">NFT PERKS</div>
                    </div>
                    <div className="mt-2">
                      {perks.map((el, index) => {
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
                    <button className="btn btn-primary-large px-10">
                      BUY ACCESS
                    </button>
                  </div>
                </div>
              </div>
            </Zoom>
          </div>
        </div>
      </ShadowBox>
    </LayoutContainer>
  );
};

export default PurchasePages;
