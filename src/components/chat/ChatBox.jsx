import CircleAvatar from "../elements/CircleAvatar";

const ChatBox = () => {
  return (
    <>
      <div className="flex flex-row">
        <CircleAvatar className="!w-[33px] !h-[33px]" />
        <div className="flex flex-col">
          <div className="flex flex-row ml-2 items-end space-x-2">
            <div className="color-placeholder font-medium f-12-px">Sinka</div>
            <div className="color-placeholder f-10-px color-description">
              12/12/2022 10:57PM
            </div>
          </div>
        </div>
      </div>
      <div>asdasd</div>
    </>
  );
};

export default ChatBox;
