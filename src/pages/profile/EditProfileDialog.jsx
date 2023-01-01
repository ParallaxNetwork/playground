import { useState } from "react";
import AlertDialog from "../../components/elements/AlertDialog";
import CollectionImage from "../../components/elements/CollectionImage";
import { isEmpty } from "lodash";
const EditProfileDialog = ({
  openEditProfile,
  handleCloseDialog,
  handleSaveProfile,
  profilePicture = "/assets/picture/placeholder.png",
}) => {
  const [formData, setFormData] = useState({
    pfp: "/assets/picture/placeholder.png",
    name: "",
    bio: "",
  });

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
              onChange={(val) => {
                if (!isEmpty(val)) {
                  setFormData({
                    ...formData,
                    pfp: val,
                  });
                }
              }}
              className="hidden"
            />
            <CollectionImage
              src={`${
                formData.pfp != profilePicture
                  ? URL.createObjectURL(formData.pfp.target.files[0])
                  : profilePicture
              }`}
              className="max-w-[128px] h-[128px] w-full ml-1"
            />
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
                onChange={(val) => {
                  if (!isEmpty(val)) {
                    setFormData({
                      ...formData,
                      name: val.target.value,
                    });
                  }
                }}
                className=" border-placeholder rounded-md h-full "
              />
            </div>
            <div className="flex flex-col w-full gap-2">
              <div className="title-secondary">Bio</div>
              <textarea
                onChange={(val) => {
                  if (!isEmpty(val)) {
                    setFormData({
                      ...formData,
                      bio: val.target.value,
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
              handleSaveProfile(formData);
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
