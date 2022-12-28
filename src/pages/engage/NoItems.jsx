import Image from "next/image";
import ShadowBox from "../../components/elements/ShadowBox";
import Link from "next/link";
const NoItems = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <ShadowBox className={"shadowBox max-w-[953px] translate-y-[10vh] md:translate-y-[20vh]"}>
        <div className="flex flex-col text-center justify-center items-center p-10 gap-10 max-w-md m-auto">
          <div className="relative aspect-[1/1] max-w-[230px] w-full">
            <Image alt="empty-box" src={"/assets/misc/empty-box.svg"} fill></Image>
          </div>
          <div className="max-w-md">
            You don't have any NFT right now, Buy NFT to engage with your idol
          </div>
          <Link href={'/'}>
            <button className="shadowBoxBtnSmall py-2 max-w-[230px] rounded-md p-3 text-center flex flex-row">
              <div className="text-center m-auto color-pink font-medium">
                Explore More NFT
              </div>
            </button>
          </Link>
        </div>
      </ShadowBox>
    </div>
  );
};

export default NoItems;
