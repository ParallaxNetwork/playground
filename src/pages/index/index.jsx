import { WalletService } from "@unlock-protocol/unlock-js";
import { InjectedConnector } from "@wagmi/core";
import {
  useAccount,
  useClient,
  useConnect,
  useNetwork,
  useSigner,
  useSignMessage
} from "wagmi";

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

  const networks = {
    5: {
      unlockAddress: "0x627118a4fB747016911e5cDA82e2E77C531e8206", // Smart contracts docs include all addresses on all networks
      provider: "https://rpc.unlock-protocol.com/5",
    },
  };
  const walletService = new WalletService(networks);

  // const getVersion = async () => {
  //   const lock = new ethers.Contract(lockAddress, PublicLockAbi, provider);

  //   console.log((await lock.publicLockVersion()).toString());
  // };

  const handleDeploy = async () => {
    await walletService.connect(provider, signer);

    try {
      const result = await walletService.createLock(
        {
          maxNumberOfKeys: 100,
          name: "testing keys",
          expirationDuration: 12121311,
          keyPrice: "0.01",
        },
        {},
        (error, hash) => {
          console.log(hash);
        }
      );
      console.log(result);
    } catch (e) {}
  };

  const handlePurchase = async () => {
    await walletService.connect(provider, signer);
    try {
      await walletService.purchaseKey(
        {
          lockAddress,
        },
        {},
        (error, hash) => {
          // This is the hash of the transaction!
          console.log({ hash });
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleWithdraw = async () => {};

  return (
    <>
      <div className="w-full h-[100vh] flex flex-col justify-center items-center">
        <div className="f-60-px w-full font-bold text-center">PLAYGROUND</div>
        <div className="f-12-px">
          <div className="flex flex-row space-x-3 mt-5 justify-center">
            <button
              onClick={() => {
                if (address) {
                  handleDeploy();
                }
              }}
              className="border-2 px-2 py-1 rounded-xl border-solid !border-black text-black"
            >
              CREATE LOCK
            </button>
            <button
              onClick={() => {
                if (address) {
                  handlePurchase();
                }
              }}
              className="border-2 px-2 py-1 rounded-xl border-solid !border-black text-black"
            >
              PURCHASE KEY
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default IndexPage;
