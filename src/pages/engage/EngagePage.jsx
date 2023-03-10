/* eslint-disable react/display-name */
import { Zoom } from "@mui/material";
import dynamic from "next/dist/shared/lib/dynamic";
import { memo, useEffect, useId, useMemo, useState } from "react";
import { useAccount, useClient, useNetwork, useSigner } from "wagmi";
import Discussion from "../../components/chat/Discussion";
import CircleAvatar from "../../components/elements/CircleAvatar";
import LayoutContainer from "../../components/elements/Container";
import NoItems from "../../components/elements/NoItems";
import ShadowBox from "../../components/elements/ShadowBox";
import SvgIconStyle from "../../components/elements/SvgIconStyle";
import Link from "next/link";
import { isEmpty } from "lodash";
import { Contract } from "ethers";
import { PGCORE_ABI } from "../../../utilities/PGCoreABI";
import { contractConfig } from "../../../utilities/contractConfig";
import { lockMeta } from "../explore/lockMeta";
import { useOrbis } from "../../context/OrbisContext";
import { useIdol } from "../../context/IdolContext";
import { useRendersCount } from "react-use";
const VideoStream = dynamic(
  () => import("../../components/videoplayer/VideoStream"),
  {
    ssr: false,
  }
);

import EngangeBox from '../../components/engange/EngangeBox'

const MemoizedVideoStream = ({ playbackID, title, userName, idolAddress, isBlocked, account }) => {
  return useMemo(() => {
    return (
      <VideoStream
        playbackID={playbackID}
        title={title}
        userName={userName}
        idolAddress={idolAddress}
        isBlocked={isBlocked}
        account={account}
      />
    )
  }, [playbackID, title, userName, idolAddress, isBlocked, account])
}

const EngagePage = () => {
  const renderCount = useRendersCount();

  const [engangeDataStatus, setEngangeDataStatus] = useState("idle"); // loading || idle || empty

  return (
    <Zoom in>
      <div>
        <LayoutContainer>
          {engangeDataStatus === "empty" &&
            <NoItems description="No idol registered yet at this time, please come back later" />
          }

          {engangeDataStatus === "loading" &&
            <div className="h-[760px] w-full secondary shadowBox flex flex-row flex-wrap p-4">
              <div className="w-full h-full rounded-md animate-pulse bg-gray-200" />
            </div>
          }

          {engangeDataStatus === "idle" &&
            <EngangeBox />
          }
        </LayoutContainer>

        <div>
          Rerender: {renderCount}
        </div>
      </div>
    </Zoom>
  );
};

export default memo(EngagePage);
