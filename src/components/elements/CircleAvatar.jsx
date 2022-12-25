const CircleAvatar = ({
  className = "",
  src = "/assets/picture/sample1.png",
  isLive = false,
}) => {
  return (
    <div className={`relative ${isLive && "pb-2"} btn`}>
      <div
        className={`bg-cover w-[35px] lg:w-[52px] h-[35px] lg:h-[52px] rounded-full overflow-hidden ${
          isLive && "border-2 border-active"
        } ${className}`}
      >
        <img
          src={src}
          className="w-full h-full object-cover object-center rounded-full"
        />
        {isLive && (
          <div className="absolute bottom-0 text-white p-1 rounded-md bg-[#E42333] f-7-px lg:f-10-px inset-x-0 lg:inset-x-1 flex flex-row items-center justify-around py-[2px]">
            <div className="w-[5px] h-[5px] rounded-full bg-white shrink-0"></div>
            LIVE
          </div>
        )}
      </div>
    </div>
  );
};

export default CircleAvatar;
