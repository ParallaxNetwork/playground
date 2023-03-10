import Image from "next/image";
import ShadowBox from "./ShadowBox";
import Link from "next/link";
const NoItems = ({
  description = "You don't have any subscription right now, Buy NFT to engage with your idol",
  isFullPage = true,
  href = "/explore",
  buttonText = "Explore More",
  isFullWidth = false,
  shadowBox = true
}) => {
  if (shadowBox) {
    return (
      <div className="flex flex-col justify-center items-center">
        <ShadowBox
          className={`shadowBox ${isFullWidth ? "w-full" : "max-w-[953px]"} ${
            isFullPage ? "translate-y-[10vh] md:translate-y-[20vh]" : ""
          } `}
        >
        <div className="flex flex-col text-center justify-center items-center p-10 gap-10 max-w-md m-auto">
          <div className="relative aspect-[1/1] max-w-[230px] w-full">
            <Image
              alt="empty-box"
              src={"/assets/misc/empty-box.svg"}
              fill
              priority
            ></Image>
          </div>
          <div className="max-w-md">{description}</div>
          <Link href={href}>
            <button className="shadowBoxBtnSmall py-2 max-w-[230px] rounded-md p-3 text-center flex flex-row">
              <div className="text-center m-auto color-pink font-medium">
                {buttonText}
              </div>
            </button>
          </Link>
        </div>
        </ShadowBox>
      </div>
    );
  }

  return (
    <div className={`flex flex-col justify-center items-center ${isFullWidth ? "w-full" : "max-w-[953px]"}`}>
      <div className="flex flex-col text-center justify-center items-center p-10 gap-10 max-w-md m-auto">
        <div className="relative aspect-[1/1] max-w-[230px] w-full">
          <Image
            alt="empty-box"
            src={"/assets/misc/empty-box.svg"}
            fill
            priority
          ></Image>
        </div>
        <div className="max-w-md">{description}</div>
        <Link href={href}>
          <button className="shadowBoxBtnSmall py-2 max-w-[230px] rounded-md p-3 text-center flex flex-row">
            <div className="text-center m-auto color-pink font-medium">
              {buttonText}
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NoItems;
