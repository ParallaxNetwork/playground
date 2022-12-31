import AlertDialog from "../../components/elements/AlertDialog";
import CollectionImage from "../../components/elements/CollectionImage";
import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { uploadToIPFS, constructMeta } from "../../../utilities/ipfsUploader";
import { ShowToast } from "../../components/elements/Toaster";
import CircularProgress from "@mui/material/CircularProgress";
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
    collectionImage: null,
    nftImage: null,
    nftImageURI: null,
    collectionImageURI: null,
    amount: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleError = (msg) => {
    setIsLoading(false);
    return ShowToast({
      message: msg,
    });
  };

  const handleUploadNFT = async () => {
    setIsLoading(true);
    const allowedType = ["jpeg", "jpg", "png", "webp", "gif"];
    let fileType;
    let uploadedData = [];
    let count = 0;
    if (isEmpty(idolRegisterData.nftImage)) {
      return handleError("Data must be filled");
    }
    //DO CHECKING FILETYPE
    for (var data of idolRegisterData.nftImage.target.files) {
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
      idolRegisterData.collectionImage.target.files[0],
    ]);
    const fileName = idolRegisterData.collectionImage.target.files[0].name;
    const fileData = JSON.stringify({
      name: `${idolRegisterData.subName}`,
      image: `https://${cid}.ipfs.nftstorage.link/${fileName}`,
      description: `Collection Image of ${idolRegisterData.subName}`,
    });
    const blob = new Blob([fileData], { type: "text/plain" });
    var file = new File([blob], `data`);
    const finalCID = await uploadToIPFS([file]);
    var tempdatas = idolRegisterData;
    tempdatas[
      "collectionImageURI"
    ] = `https://${finalCID}.ipfs.nftstorage.link/${fileName}`;
   
    setIdolRegisterData(tempdatas);
    // setIdolRegisterData({
    //   ...idolRegisterData,
    //   collectionImageURI: `https://${finalCID}.ipfs.nftstorage.link/${fileName}`,
    // });
    console.log(
      `cid collection ${`https://${cid}.ipfs.nftstorage.link/${fileName}`}`
    );
    // setIsLoading(false);
  };

  return (
    <AlertDialog
      open={openRegisterDialog}
      onClose={() => {
        setIdolRegisterData({
          duration: null,
          price: null,
          numberOfImages: null,
          subName: null,
          collectionImage: null,
          nftImage: null,
          nftImageURI: null,
          collectionImageURI: null,
          amount: null,
        });
        setIsLoading(false);
        handleCloseRegisterDialog();
      }}
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
                onChange={(val) => {
                  if (!isEmpty(val)) {
                    setIdolRegisterData({
                      ...idolRegisterData,
                      collectionImage: val,
                    });
                  }
                }}
                className="hidden"
              />
              <CollectionImage
                src={` ${
                  !isEmpty(idolRegisterData.collectionImage)
                    ? URL.createObjectURL(
                        idolRegisterData.collectionImage.target.files[0]
                      )
                    : "/assets/picture/placeholder.png"
                }  `}
                className="max-w-[128px] h-[128px] w-full ml-1"
              />
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
          <div className="flex flex-col lg:flex-row ">
            <div className="flex flex-col justify-start items-start min-w-[150px]">
              <input
                type="file"
                directory=""
                webkitdirectory=""
                disabled={isLoading}
                multiple
                id="upload-image-nft"
                onChange={(val) => {
                  if (!isEmpty(val)) {
                    setIdolRegisterData({
                      ...idolRegisterData,
                      nftImage: val,
                    });
                  }
                }}
                className="hidden"
              />
              <CollectionImage
                src={` ${
                  !isEmpty(idolRegisterData.nftImage)
                    ? URL.createObjectURL(
                        idolRegisterData.nftImage.target.files[0]
                      )
                    : "/assets/picture/placeholder-folder.png"
                }  `}
                className="max-w-[128px] h-[128px] w-full ml-1"
              />
            </div>
            <div className="flex flex-col justify-start items-start space-y-2">
              <div className="title-secondary mt-2 lg:mt-0">NFT Pictures</div>
              <div className="title-placeholder f-12-px">
                Put your NFT pictures in one folder and upload here
              </div>
              <label
                disabled={isLoading}
                htmlFor="upload-image-nft"
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
        <div className="flex-col flex space-y-10 w-full mt-10">
          <div className="flex flex-col w-full gap-2 max-h-[60px]">
            <div className="title-secondary">Subscription Name</div>
            <input
              disabled={isLoading}
              onChange={(e) => {
                setIdolRegisterData({
                  ...idolRegisterData,
                  subName: e.target.value,
                });
              }}
              className=" border-placeholder rounded-md h-full"
              placeholder="Name"
            />
          </div>
          <div className="flex flex-col w-full gap-2 max-h-[60px]">
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
          <div className="flex flex-col w-full gap-2 max-h-[60px]">
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
              placeholder="Max amount of subscription"
              type={"number"}
            />
          </div>
          <div className="flex flex-col w-full gap-2 max-h-[60px]">
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
              if (
                isEmpty(idolRegisterData.amount) ||
                isEmpty(idolRegisterData.collectionImage) ||
                isEmpty(idolRegisterData.duration.toString()) ||
                isEmpty(idolRegisterData.nftImage) ||
                isEmpty(idolRegisterData.price) ||
                isEmpty(idolRegisterData.subName)
              ) {
                return ShowToast({
                  message: "Please fill all the required data",
                  state: "error",
                });
              }

              ShowToast({
                message:
                  "Uploading your Subscription images~, dont close this popup!",
              });
              await handleUploadCollectionImage();
              ShowToast({
                message: "Yuhuu your subscription banner has been uploaded",
              });
              setTimeout(async () => {
                ShowToast({
                  message: "Uploading your NFT images~, still working 😊",
                });
                await handleUploadNFT();
                ShowToast({
                  message: "Yesss all set! please confirm the transaction",
                });
                handleSubmitRegister(idolRegisterData);
              }, 2000);
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

export default RegisterDialog;
