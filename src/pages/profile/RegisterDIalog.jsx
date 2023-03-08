import Image from "next/image";
import AlertDialog from "../../components/elements/AlertDialog";
import CollectionImage from "../../components/elements/CollectionImage";
import { useEffect, useState, useMemo } from "react";
import { isEmpty } from "lodash";
import { uploadToIPFS, constructMeta } from "../../../utilities/ipfsUploader";
import { ShowToast } from "../../components/elements/Toaster";
import CircularProgress from "@mui/material/CircularProgress";
import { duration } from "@mui/material";
const RegisterDialog = ({
  openRegisterDialog,
  handleCloseRegisterDialog,
  handleSubmitRegister,
}) => {
  const [idolRegisterData, setIdolRegisterData] = useState({
    duration: null,
    price: null,
    numberOfImages: null,
    subName: null,
    nftImageURI: null,
    collectionImageURI: null,
    amount: null,
    description: null,
    interest: null,
  });
  const [collectionImage, setCollectionImage] = useState(null);
  const [nftFiles, setNftFiles] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleError = (msg) => {
    setIsLoading(false);
    return ShowToast({
      message: msg,
      duration: 10000
    });
  };

  const handleUploadNFT = async () => {
    setIsLoading(true);
    const allowedType = ["jpeg", "jpg", "png", "webp", "gif"];
    let fileType;
    let uploadedData = [];
    let count = 0;

    if (isEmpty(nftFiles)) {
      return handleError("Data must be filled");
    }

    //DO CHECKING FILETYPE
    for (var data of Array.from(nftFiles)) {
      if (isEmpty(fileType)) {
        fileType = data.name.split(".").pop();
      }
      if (!allowedType.includes(data.name.split(".").pop().toLowerCase())) {
        return handleError(
          "File type not allowed, allowed type are jpeg, jpg, png, webp, gif"
        );
      }
      if (data.name.split(".").pop().toLowerCase() != fileType) {
        return handleError("File type must be same");
      }
      count++;

      uploadedData.push(
        new File([data], `${count}.${fileType}`, {
          type: data.type,
        })
      );
    }
    //UPLOAD IMAGE TO IPFS -> RETURN CID
    const cid = await uploadToIPFS(uploadedData);
    //CONSTRUCT / CREATE METADATA BY IMAGE CID
    const { tempJSON, nftImage } = await constructMeta({
      cid: cid,
      dataLength: uploadedData.length,
      type: fileType,
      data: {
        title: idolRegisterData.subName,
        description: `Official NFT created by ${idolRegisterData.subName}`,
      },
    });
    // setProfileImage(nftImage);

    //FINAL CID GENERATED
    const finalCID = await uploadToIPFS(tempJSON);
    var tempdata = idolRegisterData;
    tempdata["numberOfImages"] = uploadedData.length;
    tempdata["nftImageURI"] = `https://${finalCID}.ipfs.nftstorage.link/`;

    setIdolRegisterData(tempdata);
    // setIdolRegisterData({
    //   ...idolRegisterData,
    //   numberOfImages: uploadedData.length,
    //   nftImageURI: `https://${finalCID}.ipfs.nftstorage.link/`,
    // });
    console.log(`cid nftimage ${`https://${finalCID}.ipfs.nftstorage.link/`}`);
    setIsLoading(false);
  };

  const handleUploadCollectionImage = async () => {
    setIsLoading(true);
    const cid = await uploadToIPFS([
      collectionImage
    ]);
    const fileName = collectionImage.name;

    var tempdatas = idolRegisterData;
    tempdatas[
      "collectionImageURI"
    ] = `https://${cid}.ipfs.nftstorage.link/${fileName}`;

    setIdolRegisterData(tempdatas);

    console.log(
      `cid collection ${`https://${cid}.ipfs.nftstorage.link/${fileName}`}`
    );
  };

  // useEffect(() => {
  //   console.log("idolRegisterData", idolRegisterData);
  // }, [idolRegisterData]);

  const onCloseDialog = () => {
    setIdolRegisterData({
      duration: null,
      price: null,
      numberOfImages: null,
      subName: null,
      collectionImage: null,
      nftImageURI: null,
      collectionImageURI: null,
      amount: null,
      description: null,
      interest: null,
    });
    setIsLoading(false);
    handleCloseRegisterDialog();
  }

  return (
    <AlertDialog
      open={openRegisterDialog}
      onClose={onCloseDialog}
    >
      <div className="flex flex-row justify-between items-center bg-secondary text-white px-3 py-3 title-secondary border-b-2 border-black">
        REGISTER AND CREATE SUBSCRIPTION
        <img
          onClick={handleCloseRegisterDialog}
          src="/assets/icons/close-icon.svg"
          alt="close-icon"
        />
      </div>
      <div className="p-5">
        <div className="flex-col lg:flex-row flex gap-10">
          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-col justify-start items-start min-w-[150px]">
              <input
                disabled={isLoading}
                type="file"
                id="upload-image-collection"
                // only accept image
                accept="image/*"
                onChange={(val) => {
                  console.log(val.target)
                  if (!isEmpty(val.target.files)) {
                    // setIdolRegisterData({
                    //   ...idolRegisterData,
                    //   collectionImage: val,
                    // });
                    console.log(val.target.files[0])
                    setCollectionImage(val.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <SubscriptionPicture collectionImage={collectionImage} />
            </div>
            <div className="flex flex-col justify-start items-start space-y-2">
              <div className="title-secondary mt-2 lg:mt-0">
                Subscription Picture
              </div>
              <label
                disabled={isLoading}
                htmlFor="upload-image-collection"
                className="shadowBoxBtnSmall py-1 max-w-[90px] rounded-md text-center flex flex-row"
              >
                <div className="text-center m-auto color-pink font-medium">
                  {isLoading ? (
                    <CircularProgress
                      color="inherit"
                      className="!w-5 !h-5 mt-1"
                    />
                  ) : (
                    "Upload"
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-row items-center mt-8">
            <div className="flex flex-col justify-start items-start">
              <div className="title-secondary mt-2 lg:mt-0">NFT Pictures</div>
              <div className="title-placeholder f-12-px">
                Put your NFT pictures in one folder and upload here
              </div>

              <NFTPicturesPreview nftFiles={nftFiles} />


              <label
                disabled={isLoading}
                htmlFor="upload-image-nft"
                className="shadowBoxBtnSmall py-1 mt-6 max-w-[90px] rounded-md text-center flex flex-row"
              >
                <input
                  type="file"
                  directory=""
                  webkitdirectory=""
                  disabled={isLoading}
                  multiple
                  id="upload-image-nft"
                  // only accept image
                  accept="image/*"
                  onChange={(val) => {
                    if (!isEmpty(val.target.files)) {
                      // don't pick .DS_Store or any other hidden files
                      const filteredFiles = Array.from(val.target.files).filter(
                        (file) => !file.name.startsWith(".")
                      );

                      setNftFiles(filteredFiles);
                    }
                  }}
                  className="hidden"
                />
                <div className="text-center m-auto color-pink font-medium">
                  {isLoading ? (
                    <CircularProgress
                      color="inherit"
                      className="!w-5 !h-5 mt-1"
                    />
                  ) : (
                    "Upload"
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex-col flex space-y-4 w-full mt-10">
          <div className="flex flex-col w-full gap-2 ">
            <div className="title-secondary">Subscription Name</div>
            <input
              disabled={isLoading}
              onChange={(e) => {
                setIdolRegisterData({
                  ...idolRegisterData,
                  subName: e.target.value,
                });
              }}
              className="border-placeholder rounded-md h-full"
              placeholder="Name"
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <div className="title-secondary">Description</div>
            <textarea
              disabled={isLoading}
              onChange={(e) => {
                setIdolRegisterData({
                  ...idolRegisterData,
                  description: e.target.value,
                });
              }}
              className=" border-placeholder rounded-md h-full resize-none p-3"
              placeholder="Description"
              rows={3}
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <div className="title-secondary">Duration</div>
            <input
              disabled={isLoading}
              onChange={(e) => {
                setIdolRegisterData({
                  ...idolRegisterData,
                  duration: parseInt(e.target.value.toString()) * 86400,
                });
              }}
              className=" border-placeholder rounded-md h-full "
              min={1}
              placeholder="Days"
              type={"number"}
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <div className="title-secondary">Amount</div>
            <input
              disabled={isLoading}
              onChange={(e) => {
                setIdolRegisterData({
                  ...idolRegisterData,
                  amount: e.target.value,
                });
              }}
              className=" border-placeholder rounded-md h-full"
              placeholder="Max amount of subscribers"
              type={"number"}
            />
          </div>
          <div className="flex flex-col w-full gap-2 ">
            <div className="title-secondary">Price</div>
            <input
              disabled={isLoading}
              onChange={(e) => {
                setIdolRegisterData({
                  ...idolRegisterData,
                  price: e.target.value,
                });
              }}
              className=" border-placeholder rounded-md h-full"
              placeholder="Min (0.01)"
              type={"number"}
            />
          </div>
        </div>
        <div className="flex flex-row justify-end mt-[10vh]">
          <button
            onClick={async () => {
              console.log({
                idolRegisterData,
                collectionImage,
                nftFiles,
              })


              if (
                isEmpty(idolRegisterData.amount) ||
                !collectionImage ||
                isEmpty(idolRegisterData.duration.toString()) ||
                isEmpty(nftFiles) ||
                isEmpty(idolRegisterData.price) ||
                isEmpty(idolRegisterData.subName)
              ) {
                return ShowToast({
                  message: "Please fill all the required data",
                  state: "error",
                  duration: 5000
                });
              }

              ShowToast({
                message: "Uploading your Subscription images~, dont close this popup!",
                id: "register-idol",
                duration: 20000
              });

              await handleUploadCollectionImage();

              ShowToast({
                message: "Yuhuu your subscription banner has been uploaded",
                id: "register-idol"
              });

              ShowToast({
                message: "Uploading your NFT images~, still working 😊",
                id: "register-idol",
                duration: 10000
              });
              
              await handleUploadNFT();

              ShowToast({
                message: "Yesss all set! please confirm the transaction",
                id: "register-idol",
                duration: 10000
              });

              handleSubmitRegister(idolRegisterData);
            }}
            disabled={isLoading}
            className={`btn btn-primary-large`}
          >
            {isLoading ? (
              <CircularProgress color="inherit" className="!w-5 !h-5 mt-1" />
            ) : (
              "SUBMIT"
            )}
          </button>
        </div>
      </div>
    </AlertDialog>
  );
};

// Create NFTPicturesPreview component using useMemo 
const NFTPicturesPreview = ({ nftFiles }) => {
  return useMemo(() => {
    if (!isEmpty(nftFiles)) {
      return (
        <div className="grid grid-cols-12 gap-1 mt-2">
          {nftFiles &&
            Array.from(nftFiles).map((file, index) => {
              return (
                <div className="col-span-2 aspect-square" key={index}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
                  {/* <Image src={URL.createObjectURL(file)} alt="NFTtt" width={100} height={100} quality={1} className="w-full aspect-square object-cover" /> */}
                </div>
              );
            })}
        </div>
      )
    }
  }, [nftFiles]);
};

// Create SubscriptionPicture component using useMemo
const SubscriptionPicture = ({ collectionImage }) => {
  return useMemo(() => {
    return (
      <CollectionImage
        src={collectionImage ? URL.createObjectURL(collectionImage) : "/assets/picture/placeholder.png"}
        className="max-w-[128px] h-[128px] w-full ml-1"
      />
    )
  }, [collectionImage])
}

export default RegisterDialog;
