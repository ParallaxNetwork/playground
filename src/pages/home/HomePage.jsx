import { Fade, Zoom } from "@mui/material";
import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import Link from "next/link";
import ImageCarousel from '../../components/elements/ImageCarousel';
// import { Image } from 'next/image';

const MARQUEE_KEYWORDS = [
  "Playground",
  "Fan experience",
  "NFTs",
  "Direct engagement",
  "Favorite artist",
  "Exclusive experiences",
  "Decentralized technology",
  "Personalized features",
  "Direct communication",
  "Personalized experience",
];
const renderedKeywords = MARQUEE_KEYWORDS.map((item, index) => {
  return (
    <span key={index} className="mx-4 text-white">
      {item}
    </span>
  );
});

// SAMPLE
const SAMPLES = [
  "/assets/picture/sample/sample1.jpg",
  "/assets/picture/sample/sample2.jpg",
  "/assets/picture/sample/sample3.jpg",
  "/assets/picture/sample/sample4.jpg",
  "/assets/picture/sample/sample5.jpg",
]

// BANNER
const BANNERS = [
  "/assets/picture/banner/banner-1.jpg",
  "/assets/picture/banner/banner-2.jpg",
  "/assets/picture/banner/banner-3.jpg",
  "/assets/picture/banner/banner-4.jpg"
]

// MAIN FEATURES
const MAIN_FEATURES = [
  "Direct engagement opportunities with your favorite artists",
  "Purchase NFTs of your favorite artists to unlock exclusive experiences",
  "Special live stream sessions and direct communication",
];

// POWERED BY
const POWERED_BY = [
  {
    description: "Secure and private chatting with",
    thumbnail: "/assets/picture/logo/thumbnail_orbis.png",
    title: "Orbis Protocol",
    link: "https://orbis.club"
  },
  {
    description: "High-quality video streaming with",
    thumbnail: "/assets/picture/logo/thumbnail_livepeer.png",
    title: "Livepeer",
    link: "https://livepeer.org"
  },
  {
    description: "Controlled access and benefit with",
    thumbnail: "/assets/picture/logo/thumbnail_unlock.png",
    title: "Unlock Protocol",
    link: "https://unlock-protocol.com"
  },
  {
    description: "Buy NFTs and enjoy low transaction fees with",
    thumbnail: "/assets/picture/logo/thumbnail_polygon.png",
    title: "Polygon Network",
    link: "https://polygon.network"
  },
];

// BENEFITS
const BENEFITS = [
  "🤩 Join a community of die-hard fans just like you",
  "🎉 Own a piece of digital memorabilia",
  "💖 Get closer to the artists you love",
  "💫 Enjoy a personalized and unique fan experience"
];

const HomePage = () => {
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

            <div className="text-lg mt-5">Welcome to Playground!</div>
          </div>

          <div className="bg-secondary h-8 w-full border-b-2 border-t-2 border-b-black border-t-black">
            <Marquee speed={20} gradient={false}>
              {renderedKeywords}
            </Marquee>
          </div>

          <div className="bg-cream border-b-2 border-b-black">
            <div className="container max-w-6xl mx-auto">
              <div className="grid grid-cols-12">
                <div className="col-span-12 sm:col-span-9 lg:col-span-10 border-b-2 sm:border-b-0 sm:border-r-2 border-black">
                  <div className="flex flex-col h-full px-6 py-10 justify-center items-center">
                    <div className="text-base max-w-[54rem]">
                      Imagine getting up-close and personal with your favorite
                      artist. Not just a {'"'}like{'"'} or {'"'}comment{'"'}, but
                      <span className="text-secondary whitespace-nowrap font-semibold">
                        &nbsp;real, direct engagement.&nbsp;
                      </span>
                      <br />
                      <br />
                      That{"'"}s what Playground offers - the chance to own a piece
                      of your favorite artist and unlock
                      <span className="text-secondary whitespace-nowrap font-semibold">
                        &nbsp;exclusive experiences&nbsp;
                      </span>
                      you can{"'"}t get anywhere else. Buy an NFT, get VIP access.
                      It{"'"}s that simple.
                    </div>
                  </div>
                </div>

                <div className="col-span-12 sm:col-span-3 lg:col-span-2 sm:border-r-2 sm:border-r-black h-full">
                  <ImageCarousel images={SAMPLES} simple />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cream border-b-2 border-b-black">
            <div className="container max-w-6xl mx-auto border-x-2 border-black">
              <ImageCarousel images={BANNERS} />
            </div>
          </div>

          {/* MAIN FEATURES */}
          <div>
            <div className="bg-white border-2 border-b-black p-2 text-center font-semibold text-2xl">
              MAIN FEATURES
            </div>
            <div className="bg-cream border-b-2 border-b-black diagonal-stripe-box">
              <div className="container max-w-6xl mx-auto">
                <div className="grid gap-4 grid-cols-12">
                  {MAIN_FEATURES.map((item, index) => {
                    return (
                      <div className="col-span-12 md:col-span-4" key={index}>
                        <div className="p-4 border-2 border-black flex flex-col justify-center bg-white text-black h-full">
                          <div>{item}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Powered by */}
          <div className="mt-6">
            <div className="container max-w-6xl mx-auto p-2">
              <div className="border border-black">
                <div className="bg-white border border-black p-2 text-center font-semibold text-2xl">
                  Powered by
                </div>

                <div className="grid grid-cols-12">
                  {POWERED_BY.map((item, index) => {
                    return (
                      <div className="col-span-6 border border-black sm:col-span-3" key={index}>
                        <div className="bg-white flex flex-col h-full">
                          <img
                            src={item.thumbnail}
                            alt={""}
                            className={"w-full"}
                          />

                          <div className="bg-cream p-2 text-center flex-1 flex flex-col justify-end">
                            <div>{item.description}</div>

                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold">
                              {item.title}
                            </a>
                          </div>
                        </div>
                      </div>
                    );
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
                      <div key={index} className="bg-cream p-2">
                        {item}
                      </div>
                    );
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
                  Join the Playground community and elevate your fan experience
                  to the next level!
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
