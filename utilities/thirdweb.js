import { createThirdwebClient } from "thirdweb";
import { upload, resolveScheme } from "thirdweb/storage";

export const client = createThirdwebClient({
  // use `secretKey` for server side or script usage
  secretKey: process.env.THIRDWEB_SECRET_KEY,
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

export const resolveSchemeThirdweb = (uri) => {
  if (
    !uri.startsWith("ipfs://") &&
    !uri.startsWith("ipns://") &&
    !uri.startsWith("https://") &&
    !uri.startsWith("http://")
  ) {
    return uri;
  }

  return resolveScheme({
    client,
    uri,
  });
};

export const uploadToIPFSThirdweb = async (files) => {
  const cid = await upload({
    client,
    files: files,
  });

  return cid; // string or string[], in format of 'ipfs://<cid>....'
};

export const constructMetaThirdweb = async ({ data, cid }) => {
  let tempJSON = [];
  let nftImage;
  const isCIDAnArray = Array.isArray(cid);

  let _cids = [];
  if (isCIDAnArray) {
    _cids = cid;
  } else {
    _cids.push(cid);
  }

  nftImage = resolveScheme({
    client,
    uri: _cids[0],
  });

  const promises = _cids.map(async (c, i) => {
    const fileData = JSON.stringify({
      name: `${data.title} #${i + 1}`,
      image: resolveSchemeThirdweb(c),
      description: data.description,
    });
    const blob = new Blob([fileData], { type: "text/plain" });
    var file = new File([blob], `${i + 1}`);
    return file;
  });
  tempJSON = await Promise.all(promises);

  return { tempJSON, nftImage };
};
