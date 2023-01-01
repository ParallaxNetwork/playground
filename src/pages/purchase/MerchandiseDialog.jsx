import { useState } from "react";
import AlertDialog from "../../components/elements/AlertDialog";
import { CircularProgress } from "@mui/material";
import CollectionImage from "../../components/elements/CollectionImage";
import { ShowToast } from "../../components/elements/Toaster";
const MerchandiseDialog = ({
  openMerchandiseDialog,
  handleCloseMerchandiseDialog,
  imageSrc,
}) => {
  const [isLoading, setIsLoading] = useState();

  const handlePurchase = () => {
    handleCloseMerchandiseDialog();
    ShowToast({
      message: "We received your request, processing..",
    });
    setTimeout(() => {
      ShowToast({
        message: "Your payment will be confirmed shortly",
      });
    }, 3000);
    setTimeout(() => {
      ShowToast({
        message: "Payment Accepted",
      });
    }, 8000);
  };
  return (
    <AlertDialog
      open={openMerchandiseDialog}
      onClose={handleCloseMerchandiseDialog}
    >
      <div className="flex flex-row justify-between items-center bg-secondary text-white px-5 py-3 title-secondary border-b-2 border-black">
        PURCHASE MERCHANDISE
        <img
          onClick={handleCloseMerchandiseDialog}
          src="/assets/icons/close-icon.svg"
          alt="close-icon"
        />
      </div>
      <div className="p-5">
        <div className="flex flex-col lg:flex-row gap-7">
          <div className="flex flex-col justify-start items-center lg:items-start min-w-[180px]">
            <CollectionImage
              src={imageSrc?.image ?? "/assets/picture/placeholder.png"}
              className="max-w-[298px] aspect-[1.1/1.2] w-full mt-2"
            />
          </div>
          <div className="flex-col flex space-y-7 w-full">
            <div className="flex flex-col w-full gap-1  max-h-[60px]">
              <div className="subtitle">ITEM NAME</div>
              {imageSrc?.title ?? "-"}
            </div>
            <div className="flex flex-col w-full gap-1  max-h-[60px]">
              <div className="subtitle">DESCRIPTION</div>
              {imageSrc?.description ?? "-"}
            </div>
            <div className="flex flex-col w-full gap-2">
              <div className="subtitle">PRICE</div>
              <div className="font-bold">$10 / {imageSrc?.price ?? "0"}</div>
            </div>
            <hr />
            <div className="subtitle">PAYMENT DETAILS</div>
            <img
              src="/assets/picture/payment-option.png"
              className="max-w-sm"
              alt=""
            />
            <div className="flex flex-col lg:flex-row w-full gap-2">
              <div className="flex flex-col w-full gap-2">
                <div className="title-secondary">Card Number</div>
                <input
                  className=" border-placeholder rounded-md h-full "
                  min={1}
                  placeholder="your card number"
                  type={"number"}
                />
              </div>
              <div className="flex flex-col w-[1/3] gap-2">
                <div className="title-secondary">CVC</div>
                <input
                  className=" border-placeholder rounded-md h-full "
                  min={1}
                  placeholder="CVC"
                  type={"number"}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-end mt-[10vh]">
          <button
            disabled={isLoading}
            onClick={handlePurchase}
            className="btn btn-primary-large"
          >
            {isLoading ? (
              <CircularProgress color="inherit" className="!w-3 !h-3" />
            ) : (
              "PURCHASE"
            )}
          </button>
        </div>
      </div>
    </AlertDialog>
  );
};

export default MerchandiseDialog;
