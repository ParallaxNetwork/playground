import { useAccount } from "wagmi";
import axios from "axios";
import { useContext, createContext, useState, useEffect } from 'react';

const UserContext = createContext({
  subscription: null,
  getSubscription: () => {},
  isSubscribed: () => {},
});

const UserProvider = ({ children }) => {
  const { address } = useAccount();
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
      .catch((e) => {});
  };

  const isSubscribed = (lockAddress) => {
    console.log("CHECKING", lockAddress);
    
    if (!subscription) {
      return false;
    }
    
    // check if lockAddress is in subscription, no case sensitive
    return subscription.some((key) => key.lock.address.toUpperCase() === lockAddress.toUpperCase());
  }

  useEffect(() => {
    getSubscription();
  }, [])

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

  return (
    <UserContext.Provider
      value={{
        subscription,
        getSubscription,
        isSubscribed,
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