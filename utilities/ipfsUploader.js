import { NFTStorage, File, Blob } from "nft.storage";
import { PinataSDK } from "pinata";

export const minterKey = {
  NFT_STORAGE_MINTER_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGU5NDk1MDlmNDk0OEI0ODQ5ZTMwRjAyY0E0ODFjNTBhN2ZjYjAxMkEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MjUwNjc0NTM5NCwibmFtZSI6IlBMQVlHUk9VTkQifQ.CRtoWhpiDxSY20R-ff4ahSFtGld-5lcMpdvrPg0vntc",
  PINATA_JWT:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlMzBhYzBjNi1iNzY5LTQ1MzAtOGY2Yy05NTNiYmVlYjI2ZmMiLCJlbWFpbCI6Im9jdG9wdXN3YXRlcmZhbGxAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjYxMDU0ODAzNzhlNTQ4YmZmZTAwIiwic2NvcGVkS2V5U2VjcmV0IjoiYzY4YmJlYTQxNzhkYmE4MDgxODkyYzY4Mjc2Y2VlN2I4Yjk1ZTJlMTEwMWVkMDVjMjI2ZGIwNDAxZThlNTMyZiIsImV4cCI6MTc1NDg5MTY0OH0.dDbR6uVFpKgmifBfKPGoxCBcoaYhK7cNzNu4aSQcefE",
};
export const uploadToIPFS = async (data) => {
  // const client = new NFTStorage({ token: minterKey.NFT_STORAGE_MINTER_KEY })
  // const cid = await client.storeDirectory(data)
  // return cid
  const pinata = new PinataSDK({
    pinataJwt: minterKey.PINATA_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
  });

  const upload = await pinata.upload.file(data);
  console.log(upload);
  const cid = upload.IpfsHash;

  return cid;
};

export const constructMeta = async ({ data, cid, dataLength, type }) => {
  let tempJSON = [];
  let nftImage;
  for (var i = 1; i <= dataLength; i++) {
    if (i == 1) {
      nftImage = `https://${cid}.ipfs.nftstorage.link/${i}.${type}`;
    }
    const fileData = JSON.stringify({
      name: `${data.title} #${i}`,
      image: `https://${cid}.ipfs.nftstorage.link/${i}.${type}`,
      description: data.description,
    });
    const blob = new Blob([fileData], { type: "text/plain" });
    var file = new File([blob], `${i}`);
    tempJSON.push(file);
  }
  return { tempJSON, nftImage };
};
