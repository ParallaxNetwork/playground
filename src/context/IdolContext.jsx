import { Contract, providers } from "ethers";
import { createContext, useContext, useState, useEffect } from "react";
import { contractConfig } from "../../utilities/contractConfig";
import { PGCORE_ABI } from "../../utilities/PGCoreABI";
import { lockMeta } from "../pages/explore/lockMeta";
import { useClient, useNetwork } from "wagmi";
import { useOrbis } from "./OrbisContext";
import { sleep } from "../../utilities/misc";
import getActiveLivePeerStream from "../../pages/api/livepeerAPI";

const IdolContext = createContext({
  exploreData: null,
  getExploreData: () => { },
  engangeData: null,
  getEngangeData: () => { },
})

const IdolProvider = ({ children }) => {
  const { providers } = useClient()
  const { chain, chains } = useNetwork()
  const { getUserProfile } = useOrbis()

  // EXPLORE PAGE
  const [exploreData, setExploreData] = useState(null);

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
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // ENGANGE PAGE
  const [engangeData, setEngangeData] = useState(null);
  const getEngangeData = async () => {
    const contracts = new Contract(
      contractConfig.PGCORE_ADDRESS,
      PGCORE_ABI.abi,
      providers.entries().next().value[1]
    );
    const result = await contracts.getAllIdolData(1, 10);
    let tempData = [];

    for (let i = 0; i < result.length; i++) {
      if (result[i].idolAddress != "0x0000000000000000000000000000000000000000") {
        const tempMeta = await lockMeta(chain, result[i].lockAddress);
        const idolOrbis = await getUserProfile(result[i].idolAddress);

        tempData.push({
          img: idolOrbis?.profile?.pfp ?? "/assets/picture/placeholder.png",
          idolDid: idolOrbis?.did ?? "",
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
          userName: idolOrbis?.username ?? "-",
          isLive: false,
          address: result[i].idolAddress,
          groupRoom: [
            {
              title: "Fanbase",
              context: `${tempMeta.stream_id}-${result[i].idolAddress}`,
            },
          ],
        });
      }
    }

    console.log("Engange Data", tempData)

    if (tempData.length > 0) {
      // get active live streams
      const activeStreams = await getActiveLivePeerStream()
      console.log("Active Streams", activeStreams)

      for(let i = 0; i < tempData.length; i++) {
        for(let j = 0; j < activeStreams.length; j++) {
          if(tempData[i].streamID == activeStreams[j].id) {
            tempData[i].isLive = true;
          }
        }
      }

      setEngangeData(tempData);
    }
  }

  const delayedGetEngangeData = async () => {
    await sleep(1000)
    getEngangeData();
  }

  useEffect(() => {
    delayedGetEngangeData();
  }, []);

  // run fetchIdols every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getEngangeData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <IdolContext.Provider value={{
      exploreData,
      getExploreData,
      engangeData,
      getEngangeData
    }}>
      {children}
    </IdolContext.Provider>
  )
}

const useIdol = () => {
  return useContext(IdolContext);
}

export { IdolProvider, useIdol }