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
      image:
        "data:image/jpeg;base64,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",
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
      image: "data:image/png;base64,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",
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
              </ShadowBox>
            );
          })}
        </div>
      </LayoutContainer>
    </>
  );
};
export default IndexPage;
