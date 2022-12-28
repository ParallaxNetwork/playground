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
const IndexPage = () => {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { provider } = useClient();
  const { chain, chains } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const lockAddress = "0xa97a2927bdf1e8eda4e739fa4281309fefd936d0";

  //https://docs.unlock-protocol.com/tutorials/smart-contracts/ethers
  // const networks = {
  //   5: {
  //     unlockAddress: "0x627118a4fB747016911e5cDA82e2E77C531e8206", // Smart contracts docs include all addresses on all networks
  //     provider: "https://rpc.unlock-protocol.com/5",
  //   },
  // };
  // const walletService = new WalletService(networks);

  // const getVersion = async () => {
  //   const lock = new ethers.Contract(lockAddress, PublicLockAbi, provider);

  //   console.log((await lock.publicLockVersion()).toString());
  // };

  // const handleDeploy = async () => {
  //   await walletService.connect(provider, signer);

  //   try {
  //     const result = await walletService.createLock(
  //       {
  //         maxNumberOfKeys: 100,
  //         name: "testing keys",
  //         expirationDuration: 12121311,
  //         keyPrice: "0.01",
  //       },
  //       {},
  //       (error, hash) => {
  //         console.log(hash);
  //       }
  //     );
  //     console.log(result);
  //   } catch (e) {}
  // };

  // const handlePurchase = async () => {
  //   await walletService.connect(provider, signer);
  //   try {
  //     await walletService.purchaseKey(
  //       {
  //         lockAddress,
  //       },
  //       {},
  //       (error, hash) => {
  //         // This is the hash of the transaction!
  //         console.log({ hash });
  //       }
  //     );
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const idolData = [
    {
      title: "SINKA - JKT48",
      image: "/assets/picture/sample1.png",
      description:
        "Sinka Juliaah is a member of the Indonesian idol group JKT48.",
      interest: "Listening Music, Singing, Swimming",
      nftCollection: [],
      perks: [
        "• Group Chat",
        "• Private Chat",
        "• Exclusive Live Video Access",
      ],
    },
    {
      title: "SITI - CMH48",
      image: "/assets/picture/sample1.png",
      description:
        "Sinka Juliaah is a member of the Indonesian idol group JKT48.",
      interest: "Listening Music, Singing, Swimming",
      nftCollection: [],
      perks: [
        "• Group Chat",
        "• Private Chat",
        "• Exclusive Live Video Access",
      ],
    },
    {
      title: "INEM - JGJ48",
      image:
        "data:image/png;base64,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",
      description:
        "Sinka Juliaah is a member of the Indonesian idol group JKT48.",
      interest: "Listening Music, Singing, Swimming",
      nftCollection: [],
      perks: [
        "• Group Chat",
        "• Private Chat",
        "• Exclusive Live Video Access",
      ],
    },
  ];

  return (
    <>
      <LayoutContainer>
        <div className="space-y-10">
          {idolData.map((el, index) => {
            return (
              <ShadowBox key={index} className={"shadowBoxBtnSmall"}>
                <Link
                  href={{
                    pathname: "/purchase",
                  }}
                >
                  <div className="flex flex-row justify-between items-center bg-secondary text-white px-5 py-3 title-primary border-b-2 border-black">
                    {el.title}
                    <img src="/assets/icons/hearts-icon.svg" alt="" />
                  </div>
                  <div className="flex m-5 flex-col lg:flex-row p-2">
                    <CollectionImage
                      src={el.image}
                      className="aspect-[1/1] max-w-[340px] w-full"
                    />
                    <div className="ml-0 mt-5 lg:ml-5 lg:mt-[-9px] flex flex-col lg:flex-row justify-start w-full">
                      <div className="max-w-full lg:pr-5">
                        <div className="subtitle">DESCRIPTION</div>
                        <div>{el.description}</div>
                        <div className="subtitle mt-4">Interest</div>
                        <div>{el.interest}</div>
                        <div className="subtitle mt-4">NFT Collection</div>
                      </div>
                      <div className="max-w-full ml-0 mt-5 lg:mt-0 lg:ml-5">
                        <div className="flex flex-row space-x-3">
                          <img src="/assets/icons/verified-icon.svg" alt="" />
                          <div className="subtitle">NFT PERKS</div>
                        </div>
                        <div className="mt-2">
                          {el.perks.map((child, i) => {
                            return (
                              <div
                                key={i}
                                className="block font-medium text-fill"
                              >
                                {child}
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
