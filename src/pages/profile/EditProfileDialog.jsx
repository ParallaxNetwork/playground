import AlertDialog from "../../components/elements/AlertDialog";
import CollectionImage from "../../components/elements/CollectionImage";

const EditProfileDialog = ({
  openEditProfile,
  handleCloseDialog,
  handleSaveProfile,
  profilePicture = "/assets/picture/sample1.png",
}) => {
  return (
    <AlertDialog open={openEditProfile} onClose={handleCloseDialog}>
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
            <CollectionImage
              src={profilePicture}
              className="max-w-[128px] h-[128px] w-full ml-1"
            />
            <button className="shadowBoxBtnSmall py-1 max-w-[90px] rounded-md text-center flex flex-row lg:ml-5">
              <div className="text-center m-auto color-pink font-medium">
                Change
              </div>
            </button>
          </div>
          <div className="flex-col flex space-y-10 w-full">
            <div className="flex flex-col w-full gap-2 max-h-[60px]">
              <div className="title-secondary">Name</div>
              <input className=" border-placeholder rounded-md h-full " />
            </div>
            <div className="flex flex-col w-full gap-2">
              <div className="title-secondary">Bio</div>
              <textarea
                rows={10}
                className="p-3 border-placeholder rounded-md h-full resize-none"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-end mt-[10vh]">
          <button onClick={handleSaveProfile} className="btn btn-primary-large">
            SAVE
          </button>
        </div>
      </div>
    </AlertDialog>
  );
};

export default EditProfileDialog;
