import axios from 'axios'
import { create } from 'ipfs-http-client'
import { ThirdwebStorage } from "@thirdweb-dev/storage";

const DWEB_API_URL = "https://dweb.link/api/v0"

export const getIPFSFileCount = async (ipfsHash) => {
  try {
    const res = await axios({
      method: "get",
      url: `${DWEB_API_URL}/ls?arg=${ipfsHash}`,
    })

    return res.data.Objects[0].Links.length
  } catch (e) {
    console.log("Error: ", e)
  }
}

export const getCIDFromNFTStorageLink = (link) => {
  const start = link.indexOf("https://") + 8; // Find the index of the start of the hash
  const end = link.indexOf(".", start); // Find the index of the end of the hash
  return link.substring(start, end); // Extract the hash substring
}