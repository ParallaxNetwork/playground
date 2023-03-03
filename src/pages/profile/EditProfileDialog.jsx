import { useEffect, useState } from "react";
import AlertDialog from "../../components/elements/AlertDialog";
import CollectionImage from "../../components/elements/CollectionImage";
import { isEmpty } from "lodash";

import { useOrbis } from "../../context/OrbisContext";

const EditProfileDialog = ({
  openEditProfile,
  handleCloseDialog,
  handleSaveProfile,
  profilePicture = "/assets/picture/placeholder.png",
}) => {
  const { profile, refetchProfile } = useOrbis()

  const [pfpFile, setPfpFile] = useState();
  const [formData, setFormData] = useState({
    pfp: profile?.details?.profile?.pfp ?? "/assets/picture/placeholder.png",
    username: "",
    description: "",
  });

  useEffect(() => {
    if (openEditProfile) {
      setFormData({
        pfp: profile?.details?.profile?.pfp ?? "/assets/picture/placeholder.png",
        username: profile?.username ?? "",
        description: profile?.details?.profile?.description ?? "",
      })
    }
  }, [openEditProfile, profile])

  return (
    <AlertDialog
      open={openEditProfile}
      onClose={() => {
        // setFormData({
        //   pfp: "/assets/picture/placeholder.png",
        //   name: "",
        //   bio: "",
        // });
        handleCloseDialog();
      }}
    >
      <div className="flex flex-row justify-between items-center bg-secondary text-white px-3 py-3 title-secondary border-b-2 border-black">
        EDIT PROFILE
        <img
          onClick={handleCloseDialog}
          src="/assets/icons/close-icon.svg"
          alt="close-icon"
        />
      </div>

      <div className="p-5">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex flex-col justify-start items-center lg:items-start gap-4 min-w-[180px]">
            <div className="title-secondary">Profile Picture</div>
            <input
              type="file"
              id="upload-pfp"
              // only accept images, jpeg jpg png
              accept="image/*"
              onChange={(val) => {
                if (!isEmpty(val)) {
                  console.log(val.target.files[0])
                  setFormData({
                    ...formData,
                    pfp: URL.createObjectURL(val.target.files[0]),
                  });
                  setPfpFile(val.target.files[0]);
                }
              }}
              className="hidden"
            />
            <div className="aspect-square w-full max-w-[10rem] ring-2 ring-black flex items-center justify-center">
              {/* <CollectionImage
                src={formData?.pfp}
                className="w-full"
                noBorder
              /> */}
              <img src={formData?.pfp} alt="" />
            </div>

            <label
              htmlFor="upload-pfp"
              className="shadowBoxBtnSmall py-1 max-w-[90px] rounded-md text-center flex flex-row lg:ml-5"
            >
              <div className="text-center m-auto color-pink font-medium">
                Change
              </div>
            </label>
          </div>
          <div className="flex-col flex space-y-10 w-full">
            <div className="flex flex-col w-full gap-2 max-h-[60px]">
              <div className="title-secondary">Name</div>
              <input
                value={formData?.username || ""}
                onChange={(val) => {
                  if (!isEmpty(val)) {
                    setFormData({
                      ...formData,
                      username: val.target.value,
                    });
                  }
                }}
                className=" border-placeholder rounded-md h-full "
              />
            </div>
            <div className="flex flex-col w-full gap-2">
              <div className="title-secondary">Bio</div>
              <textarea
                value={formData?.description || ""}
                onChange={(val) => {
                  if (!isEmpty(val)) {
                    setFormData({
                      ...formData,
                      description: val.target.value,
                    });

                  }
                }}
                rows={10}
                className="p-3 border-placeholder rounded-md h-full resize-none"
              />
            </div>

          </div>
        </div>
        <div className="flex flex-row justify-end mt-[10vh]">
          <button
            onClick={() => {
              handleSaveProfile({
                ...formData,
                pfpFile
              });
            }}
            className="btn btn-primary-large"
          >
            SAVE
          </button>
        </div>
      </div>
    </AlertDialog>
  );
};

export default EditProfileDialog;
