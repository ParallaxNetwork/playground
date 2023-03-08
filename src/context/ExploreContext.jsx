import { Contract, providers } from "ethers";
import { createContext, useContext, useState, useEffect } from "react";
import { contractConfig } from "../../utilities/contractConfig";
import { PGCORE_ABI } from "../../utilities/PGCoreABI";
import { lockMeta } from "../pages/explore/lockMeta";
import { useClient, useNetwork } from "wagmi";

const ExploreContext = createContext({
  exploreData: null,
  getExploreData: () => { },
})

const ExploreProvider = ({ children }) => {
  const [exploreData, setExploreData] = useState(null);
  const { providers } = useClient()
  const { chain, chains } = useNetwork()

  const getExploreData = async () => {
    // fetch data
    // setExploreData(data)
    const contracts = new Contract(
      contractConfig.PGCORE_ADDRESS,
      PGCORE_ABI.abi,
      providers.entries().next().value[1]
    );

    const result = await contracts.getAllIdolData(1, 10);

    let tempData = [];
    for (var i = 0; i < result.length; i++) {
      if (
        result[i].idolAddress != "0x0000000000000000000000000000000000000000"
      ) {
        var tempMeta = await lockMeta(chain, result[i].lockAddress);

        tempData.push({
          lockName: result[i].lockName,
          lockAddress: result[i].lockAddress,
          lockImage: result[i].lockImage,
          nftKeyAddress: result[i].nftKeyAddress,
          idolAddress: result[i].idolAddress,
          playbackID: tempMeta.stream_playbackId,
          streamID: tempMeta.stream_id,
          description: tempMeta.description,
          interest: tempMeta.interest,
          perks: tempMeta.perks,
        });
      }
    }

    // reverse the array so the newest locks are at the top
    tempData.reverse();
    
    setExploreData(tempData);
  }

  useEffect(() => {
    getExploreData();
  }, []);

  // run fetchIdols every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getExploreData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ExploreContext.Provider value={{
      exploreData,
      getExploreData
    }}>
      {children}
    </ExploreContext.Provider>
  )
}

const useExplore = () => {
  return useContext(ExploreContext);
}

export { ExploreProvider, useExplore }