import { useAccount, useSigner } from "wagmi";
import axios from "axios";
import { useContext, createContext, useState, useEffect } from 'react';
import { contractConfig } from '../../utilities/contractConfig';
import { PGSUBS_ABI } from '../../utilities/PGSubsABI';
import { Contract } from '@ethersproject/contracts';
import { PGCORE_ABI } from '../../utilities/PGCoreABI';

const UserContext = createContext({
  subscription: null,
  getSubscription: () => { },
  isSubscribed: () => { },

  userCollection: null,
  getUserCollection: () => { }
});

const UserProvider = ({ children }) => {
  const { address } = useAccount();
  const { data: signer, isError } = useSigner();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, [])

  // SUBSCRIPTION
  const [subscription, setSubscription] = useState(null);
  const getSubscription = () => {
    if (!address) {
      return;
    }

    let data = JSON.stringify({
      query:
        "query AllKeys($first: Int = 1, $skip: Int, $where: Key_filter, $orderBy: Key_orderBy, $orderDirection: OrderDirection) {\n  keys(\n    first: $first\n    skip: $skip\n    where: $where\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n  ) {\n    id\n    lock {\n      id\n      address\n      name\n      expirationDuration\n      tokenAddress\n      price\n      lockManagers\n      version\n      createdAtBlock\n      totalKeys\n    }\n    tokenId\n    owner\n    manager\n    expiration\n    tokenURI\n    createdAtBlock\n    cancelled\n  }\n}",
      variables: {
        first: 1000,
        where: {
          owner: address,
        },
        orderBy: "expiration",
        orderDirection: "desc",
      },
      operationName: "AllKeys",
    });
    let config = {
      method: "post",
      url:
        process.env.NODE_ENV == "production"
          ? process.env.NEXT_PUBLIC_SUBGRAPH_MAINNET
          : process.env.NEXT_PUBLIC_SUBGRAPH_TESTNET,

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async (response) => {
        setSubscription(response.data.data.keys);
      })
      .catch((e) => { });
  };

  const isSubscribed = (lockAddress) => {
    if (!subscription) {
      return false;
    }

    // check if lockAddress is in subscription, no case sensitive
    return subscription.some((key) => key.lock.address.toUpperCase() === lockAddress.toUpperCase());
  }

  // Renew Subscription
  // const handleRenewKey = (nftAddress) => {
  //   console.log("NFT ADDRESS", nftAddress);
  // }

  useEffect(() => {
    if (address) {
      if (!subscription) {
        getSubscription();
      }

      if (!userCollection) {
        getUserCollection();
      }
    }
  }, [address, signer])

  // run getSubscription every 30 seconds
  useEffect(() => {
    if (!address) {
      return;
    }
    const interval = setInterval(() => {
      getSubscription();
    }, 30000);
    return () => clearInterval(interval);
  }, [address]);

  useEffect(() => {
    console.log("Subscription", subscription);
  }, [subscription])


  // GET USER NFTs
  const [userCollection, setUserCollection] = useState(null);
  const getUserCollection = async () => {
    if (!address || !signer) {
      return;
    }

    // Get All nftKeyAddress
    const coreContracts = new Contract(
      contractConfig.PGCORE_ADDRESS,
      PGCORE_ABI.abi,
      signer
    );
    const res = await coreContracts.getAllIdolData(1, 10);

    // assign res.nftKeyAddress to nftKeyAddresses if it's not empty
    const nftKeyAddresses = [];
    for (let i = 0; i < res.length; i += 1) {
      if (res[i].nftKeyAddress !== "0x0000000000000000000000000000000000000000") {
        nftKeyAddresses.push(res[i].nftKeyAddress);
      }
    }
    console.log("NFT KEY ADDRESSES", nftKeyAddresses);

    let collection = [];
    let collectionIds = [];

    for(let i = 0; i < nftKeyAddresses.length; i += 1) {
      const contracts = new Contract(
        nftKeyAddresses[i],
        PGSUBS_ABI.abi,
        signer
      );

      const totalSupply = await contracts.totalSupply();

      const maxId = totalSupply.toNumber();

      for (let j = 1; j <= maxId; j++) {
        // check with ownerOf
        const checkOwnership = await contracts.ownerOf(j);

        if (checkOwnership === address) {
          collectionIds.push({
            tokenId: j,
            nftKeyAddress: nftKeyAddresses[i]
          });
        }
      };
    }

    // console.log("Owned NFT ID", collectionIds)

    for(let i=0; i <collectionIds.length; i += 1){
      const contracts = new Contract(
        collectionIds[i].nftKeyAddress,
        PGSUBS_ABI.abi,
        signer
      );

      const tokenURI = await contracts.tokenURI(collectionIds[i].tokenId);
      const tokenData = await axios.get(tokenURI);
      collection.push({
        ...tokenData.data,
        tokenId: collectionIds[i],
      });
    }

    console.log("Collection", collection);
    setUserCollection(collection);
  }

  if (!isMounted) {
    return "";
  }

  return (
    <UserContext.Provider
      value={{
        subscription,
        getSubscription,
        isSubscribed,

        userCollection,
        getUserCollection
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  return useContext(UserContext);
}

export { UserProvider, useUser };