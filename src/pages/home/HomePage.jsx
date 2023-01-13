import { Fade, Zoom } from "@mui/material";
import Marquee from "react-fast-marquee";
import { useEffect, useState } from 'react';
import { isEmpty } from "lodash";
import Link from "next/link";
import CollectionImage from "../../components/elements/CollectionImage";
import LayoutContainer from "../../components/elements/Container";
import NoItems from "../../components/elements/NoItems";
import ShadowBox from "../../components/elements/ShadowBox";
import SvgIconStyle from "../../components/elements/SvgIconStyle";

const MARQUEE_KEYWORDS = ["Playground", "Fan experience", "NFTs", "Direct engagement", "Favorite artist", "Exclusive experiences", "Decentralized technology", "Personalized features", "Direct communication", "Personalized experience"];
const renderedKeywords = MARQUEE_KEYWORDS.map((item, index) => {
  return (
    <span key={index} className="mx-4 text-white">
      {item}
    </span>
  )
});

// MAIN FEATURES
const MAIN_FEATURES = [
  "Direct engagement opportunities with your favorite artists",
  "Purchase NFTs of your favorite artists to unlock exclusive experiences",
  "Special live stream sessions and direct communication"
]

// POWERED BY
const POWERED_BY = [
  {
    description: "Secure and private chatting with",
    thumbnail: "/assets/picture/logo/thumbnail_orbis.png",
    title: "Orbis Protocol"
  },
  {
    description: "Secure and private chatting with",
    thumbnail: "/assets/picture/logo/thumbnail_livepeer.png",
    title: "Livepeer"
  },
  {
    description: "Secure and private chatting with",
    thumbnail: "/assets/picture/logo/thumbnail_unlock.png",
    title: "Unlock Protocol"
  },
]

const BENEFITS = [
  "Join a community of die-hard fans just like you",
  "Own a piece of digital memorabilia",
  "Get closer to the artists you love",
  "Enjoy a personalized and unique fan experience"
]

const HomePage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
  }, [])

  return (
    <Fade in>
      <div>
        {/* <LayoutContainer> */}
        <div className="py-10 pb-[20rem]">
          <div className="bg-secondary h-8 w-full border-b-2 border-t-2 border-b-black border-t-black">
            <Marquee direction="right" speed={20} gradient={false}>
              {renderedKeywords}
            </Marquee>
          </div>

          <div className="flex flex-col text-center justify-center items-center bg-white/60 px-6 py-10">
            <div className="text-3xl font-semibold max-w-[34rem]">
              Ready for a
              <span className="text-secondary whitespace-nowrap">
                &nbsp;one-of-a-kind&nbsp;
              </span>
              fan experience?
            </div>

            <div className="text-lg mt-5">
              Welcome to Playground!
            </div>
          </div>

          <div className="bg-secondary h-8 w-full border-b-2 border-t-2 border-b-black border-t-black">
            <Marquee speed={20} gradient={false}>
              {renderedKeywords}
            </Marquee>
          </div>

          <div className="bg-[#FFF9F9] border-b-2 border-b-black">
            <div className="container max-w-6xl mx-auto">
              <div className="grid grid-cols-12">
                <div className="col-span-12 sm:col-span-9 lg:col-span-10 border-b-2 sm:border-b-0 sm:border-r-2 border-black">
                  <div className="flex flex-col h-full px-6 py-10 justify-center items-center">
                    <div className="text-base max-w-[54rem]">
                      Imagine getting up-close and personal with your favorite artist. Not just a "like" or "comment", but
                      <span className="text-secondary whitespace-nowrap font-semibold">
                        &nbsp;real, direct engagement.&nbsp;
                      </span>

                      <br /><br />

                      That's what Playground offers - the chance to own a piece of your favorite artist and unlock
                      <span className="text-secondary whitespace-nowrap font-semibold">
                        &nbsp;exclusive experiences&nbsp;
                      </span>
                      you can't get anywhere else. Buy an NFT, get VIP access. It's that simple.
                    </div>
                  </div>
                </div>

                <div className="col-span-12 sm:col-span-3 lg:col-span-2 sm:border-r-2 sm:border-r-black">
                  <img src={"/assets/picture/sample1.png"} alt={""} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FFF9F9] border-b-2 border-b-black">
            <div className="container max-w-6xl mx-auto">
              <div className="text-center h-64 bg-slate-200">
                BANNER PLACEHOLDER
              </div>
            </div>
          </div>

          {/* MAIN FEATURES */}
          <div>
            <div className="bg-white border-2 border-b-black p-2 text-center font-semibold text-2xl">
              MAIN FEATURES
            </div>
            <div className="bg-[#FFF9F9] border-b-2 border-b-black diagonal-stripe-box">
              <div className="container max-w-6xl mx-auto">
                <div className="grid gap-4 grid-cols-12">
                  {MAIN_FEATURES.map((item, index) => {
                    return (
                      <div className="col-span-12 md:col-span-4" key={index}>
                        <div className="p-4 border-2 border-black flex flex-col justify-center bg-white text-black h-full">
                          <div>
                            {item}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Powered by */}
          <div className="mt-6">
            <div className="container max-w-6xl mx-auto p-2">
              <div className="border-2 border-black">
                <div className="bg-white border-b-2 border-black p-2 text-center font-semibold text-2xl">
                  Powered by
                </div>

                <div className="grid grid-cols-12 divide-black divide-y-2 sm:divide-y-0 sm:divide-x-2">
                  {POWERED_BY.map((item, index) => {
                    return (
                      <div className="col-span-12 sm:col-span-4" key={index}>
                        <div className="bg-white">
                          <img src={item.thumbnail} alt={""} className={"w-full"} />

                          <div className="bg-[#FFF9F9] p-2 text-center">
                            <div>
                              {item.description}
                            </div>
                            <div className="text-lg font-semibold">
                              {item.title}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-6">
            <div className="container max-w-6xl mx-auto p-2">
              <div className="border-2 border-black">
                <div className="bg-white border-b-2 border-black p-2 text-center font-semibold text-2xl">
                  Benefits
                </div>

                <div className="divide-black divide-y-2">
                  {BENEFITS.map((item, index) => {
                    return (
                      <div key={index} className="bg-[#FFF9F9] p-2">
                        {item}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="container max-w-6xl mx-auto p-2 mt-10">
            <div className="flex items-center justify-center h-[16rem] p-2">
              <div className="flex flex-col items-center text-center">
                <div className="text-lg font-semibold max-w-[32rem]">
                  Join the Playground community and elevate your fan experience to the next level!
                </div>

                <Link href={"/explore"}>
                  <button className="btn btn-primary-large mt-4">
                    Explore
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default HomePage;
