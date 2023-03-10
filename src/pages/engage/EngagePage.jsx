/* eslint-disable react/display-name */
import { Zoom } from "@mui/material";
import dynamic from "next/dist/shared/lib/dynamic";
import { memo, useMemo, useState } from "react";
import LayoutContainer from "../../components/elements/Container";
import NoItems from "../../components/elements/NoItems";
const VideoStream = dynamic(
  () => import("../../components/videoplayer/VideoStream"),
  {
    ssr: false,
  }
);

import EngangeBox from '../../components/engange/EngangeBox'

const EngagePage = () => {
  return (
    <Zoom in>
      <div>
        <LayoutContainer>
          <EngangeBox />
        </LayoutContainer>
      </div>
    </Zoom>
  );
};

export default memo(EngagePage);
