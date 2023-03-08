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

  const [pfpFile, setPfpFile] = useState(null);
  const [formData, setFormData] = useState({
    pfp: profile?.details?.profile?.pfp ?? '',
    cover: profile?.details?.profile?.cover ?? null,
    data: profile?.details?.profile?.data ?? null,
    username: profile?.username ?? "",
    description: profile?.details?.profile?.description ?? "",
  });

  useEffect(() => {
    if (openEditProfile) {
      setFormData({
        pfp: profile?.details?.profile?.pfp ?? '',
        cover: profile?.details?.profile?.cover || null,
        data: profile?.details?.profile?.data || null,
        username: profile?.details?.profile?.username || '',
        description: profile?.details?.profile?.description || null
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
          <div className="flex flex-col justify-start items-center lg:items-center gap-4 min-w-[180px]">
            <div className="title-secondary font-bold mr-auto">Profile Picture</div>
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
            {/* <div className="aspect-square w-full max-w-[10rem] ring-2 ring-black flex items-center justify-center">
              <img src={formData?.pfp} alt="" />
            </div> */}

            <div className="aspect-square w-full max-w-[12rem] max-h-[12rem] ring-2 ring-black flex items-center justify-center">
              <img src={formData?.pfp ? formData.pfp : "/assets/picture/placeholder.png"} alt="" className="max-w-full max-h-full" />
            </div>

            <label
              htmlFor="upload-pfp"
              className="shadowBoxBtnSmall py-1 max-w-[90px] rounded-md text-center flex flex-row"
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
              handleSaveProfile(formData, pfpFile);
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
