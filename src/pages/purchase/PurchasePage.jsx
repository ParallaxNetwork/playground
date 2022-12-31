import LayoutContainer from "../../components/elements/Container";
import ShadowBox from "../../components/elements/ShadowBox";
import CollectionImage from "../../components/elements/CollectionImage";
import SvgIconStyle from "../../components/elements/SvgIconStyle";
import { Zoom } from "@mui/material";
import { useState } from "react";
import AlertDialog from "../../components/elements/AlertDialog";
import Link from "next/link";
const PurchasePages = () => {
  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenPurchaseDialog(false);
  };

  const handlePurchase = () => {};

  const perks = [
    {
      title: "Group Chat 1 Month",
      description:
        "You can join exclusive group chat with Sinka and get the latest information",
    },
    {
      title: "Private Chat",
      description:
        "You can join exclusive group chat with Sinka and get the latest information",
    },
    {
      title: "Exclusive Live Video Access",
      description:
        "You can join exclusive group chat with Sinka and get the latest information",
    },
  ];

  const sellItem = [
    {
      title: "Bucket Hat",
      image: "/assets/picture/bucket-hat.jpg",
      description: "Sinka's preloved bucket hat, i bet you like it",
      price: "0.01 MATIC",
    },
    {
      title: "BY Cardigan",
      image: "/assets/picture/cardigan.jpg",
      description: "Rewind back a few years ago, such a memorable items",
      price: "0.02 MATIC",
    },
  ];

  return (
    <>
      <LayoutContainer>
        <Link href="/">
          <button className="shadowBoxBtnSmall py-2 max-w-[115px] rounded-[10px] text-center flex flex-row mb-5 bg-white">
            <div className="text-center m-auto font-medium flex flex-row">
              <SvgIconStyle
                src={"/assets/icons/arrowprev-icon.svg"}
                className="bg-red w-[25px] h-[15px] mt-[1px] md:mt-1"
              />
              Explore
            </div>
          </button>
        </Link>

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
                  className={`flex flex-col lg:flex-row border-2 border-black p-3 w-full gap-5`}
                >
                  <CollectionImage
                    src={"/assets/picture/sample3.png"}
                    className="max-w-[136px] w-full max-h-[195px] aspect-[1/3] m-auto mt-5 mb-5 lg:m-0"
                  />

                  <div className="mt-3 lg:mt-0 flex flex-col justify-between w-full gap-3 p-2">
                    <div className="max-w-full w-full flex flex-col justify-between ">
                      <div>
                        <div className="title-primary">SINKA 123</div>
                        <div className="subtitle">0.2 MATIC</div>
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row w-full">
                      <div className="space-y-3 max-w-[380px]">
                        <div className="subtitle">DESCRIPTION</div>
                        <div>
                          Sinka Juliaah is a member of the Indonesian idol group
                          JKT48.
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-row w-full justify-between">
                        <div className="mt-5 lg:mt-0 justify-end flex flex-col space-y-3">
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
                                  {el.title}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="h-full flex flex-col justify-end mt-3 mb-2 lg:mt-0 lg:mb-0">
                          <button
                            onClick={() => {
                              setOpenPurchaseDialog(true);
                            }}
                            className="btn btn-primary-large px-10"
                          >
                            BUY ACCESS
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Zoom>
            </div>

            <div className="mt-10">
              <div className="border-2 border-black">
                <div className="grid grid-rows-1 lg:grid-cols-5 p-2 gap-3 m-4">
                  {sellItem.map((el, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center border-2 border-black p-5 lg:p-2"
                      >
                        <CollectionImage
                          src={el.image}
                          className="w-full max-w-[413px] aspect-[1/1]"
                        />
                        <div className="flex gap-2 mt-3 subtitle items-center">
                          {el.title}
                        </div>
                        <div className="flex flex-wrap f-12-px text-center mt-3">
                          {el.description}
                        </div>
                        <div className="f-12-px bg-placeholder mt-5">
                          {el.price}
                        </div>
                        <button className="btn btn-primary-large mt-2 mb-3">
                          BUY MERCHANDISE
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </ShadowBox>
      </LayoutContainer>

      <AlertDialog open={openPurchaseDialog} onClose={handleCloseDialog}>
        <div className="flex flex-row justify-between items-center bg-secondary text-white px-5 py-3 title-secondary border-b-2 border-black">
          BUY SUBSCRIPTION
          <img
            onClick={handleCloseDialog}
            src="/assets/icons/close-icon.svg"
            alt="close-icon"
          />
        </div>
        <div className="p-5">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex flex-col justify-start items-center lg:items-start min-w-[180px]">
              <CollectionImage
                src="/assets/picture/sample3.png"
                className="max-w-[208px] aspect-[1.1/1.5] w-full mt-2"
              />
            </div>
            <div className="flex-col flex space-y-10 w-full">
              <div className="flex flex-col w-full gap-1  max-h-[60px]">
                <div className="subtitle">DESCRIPTION</div>
                Sinka Juliaah is a member of the Indonesian idol group JKT48.
              </div>
              <div className="flex flex-col w-full gap-2">
                <div className="subtitle">NFT PERKS</div>
                {perks.map((el, index) => {
                  return (
                    <div key={index} className="flex flex-row gap-3">
                      <SvgIconStyle
                        src={"/assets/icons/love-icon.svg"}
                        className="bg-red w-[25px] h-[15px] mt-[1px] md:mt-1"
                      />
                      <div className="flex flex-col">
                        <div className="text-fill">{el.title}</div>
                        <div className="bg-placeholder">{el.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end mt-[10vh]">
            <button onClick={handlePurchase} className="btn btn-primary-large">
              PURCHASE
            </button>
          </div>
        </div>
      </AlertDialog>
    </>
  );
};

export default PurchasePages;
