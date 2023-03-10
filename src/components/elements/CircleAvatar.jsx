import { useOrbis } from "../../context/OrbisContext";
import { useState, useEffect } from "react";
import makeBlockie from "ethereum-blockies-base64";
const CircleAvatar = ({
  className = "",
  isLive = false,
  isActive = false,
  image = null,
  address = null,
}) => {

  const { orbis } = useOrbis();
  const [src, setSrc] = useState();
  const getAvatarCache = () => {
    const avatarCache = localStorage.getItem("avatarCache");
    if (avatarCache === null) {
      localStorage.setItem(
        "avatarCache",
        JSON.stringify({ info: "mindblowon" })
      );
    }

    return JSON.parse(localStorage.getItem("avatarCache"));
  };

  const getImage = async () => {
    if (image) {
      // If image is provided
      setSrc(image);
    } else if (!address && !image) {
      // Revert to default image
      setSrc(null);
    } else {
      // If address is provided
      const avatarCache = getAvatarCache();

      if (avatarCache[address]) {
        setSrc(avatarCache[address]);
      }

      const { data, error } = await orbis.getDids(address);

      if (!error && data.length > 0) {
        if (data[0].details?.profile?.pfp) {
          setSrc(data[0].details?.profile?.pfp);

          const tempAvatar = `{"${address}": "${data[0].details?.profile?.pfp}"}`;
          const avatarData = JSON.parse(tempAvatar);
          const assigned = Object.assign(avatarCache, avatarData);

          localStorage.setItem("avatarCache", JSON.stringify(assigned));
        } else {
          setSrc(makeBlockie(address));
        }
      } else {
        setSrc(makeBlockie(address));
      }
    }
  };

  useEffect(() => {
    if (!src) {
      getImage();
    }
  }, [image, address]);

  return (
    <div className={`relative ${isLive && "pb-2"} btn`}>
      <div
        className={`bg-cover w-[33px] lg:w-[52px] h-[33px] lg:h-[52px] rounded-full overflow-hidden ${(isLive || isActive) && "border-2 border-active"
          } ${className}`}
      >
        <img
          alt=""
          src={src ?? "/assets/picture/placeholder.png"}
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
