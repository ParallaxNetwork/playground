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
  ];

  return (
    <>
      <LayoutContainer>
        <div className="space-y-10">
          {idolData.map((el, index) => {
            return (
              <ShadowBox key={index} className={"shadowBoxBtn"}>
                <div className="flex flex-row justify-between items-center bg-primary text-white px-5 py-3 title-primary border-b-2 border-black">
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
                            <div key={i} className="block font-medium">
                              {child}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </ShadowBox>
            );
          })}
        </div>
      </LayoutContainer>
    </>
  );
};
export default IndexPage;
