import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadFile(file, directory, filename, doConfig) {
  console.log(file, directory, filename);

  const s3Client = new S3Client({
    endpoint: doConfig.DO_SPACES_ORIGIN,
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    region: "us-east-1", // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
    credentials: {
      accessKeyId: doConfig.DO_SPACES_ID, // Access key pair. You can create access key pairs using the control panel or API.
      secretAccessKey: doConfig.DO_SPACES_SECRET, // Secret access key defined through an environment variable.
    },
  });

  const fileBuffer = await file.arrayBuffer();
  const timestamp = Date.now();
  filename = filename ?? `${timestamp}-${file.name}`;
  const objectKey = `${directory}/${filename}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: doConfig.DO_SPACES_BUCKET,
      Key: `${objectKey}`,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
      Metadata: {
        name: file.name,
        type: file.type,
      },
      ACL: "public-read",
      CacheControl: "no-cache",
    })
  );

  return {
    filename,
    objectKey,
  };
}

export const constructMetaWeb2 = async ({
  data,
  imageUrls,
  dataLength,
  type,
}) => {
  let tempJSON = [];
  let nftImage;
  for (var i = 1; i <= dataLength; i++) {
    if (i == 1) {
      nftImage = imageUrls[0];
    }
    const fileData = JSON.stringify({
      name: `${data.title} #${i}`,
      image: imageUrls[i - 1],
      description: data.description,
    });
    const blob = new Blob([fileData], { type: "text/plain" });
    var file = new File([blob], `${i}`);
    tempJSON.push(file);
  }
  return { tempJSON, nftImage };
};
