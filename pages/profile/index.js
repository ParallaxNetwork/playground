import dynamic from "next/dynamic";

import {
  createReactClient,
  LivepeerConfig,
  studioProvider,
} from "@livepeer/react";

export function getStaticProps({ req, params }) {
  return {
    props: {
      data: {
        API_KEY: process.env.LIVEPEER_API_KEY,
        DO_SPACES_ID: process.env.DO_SPACES_ID,
        DO_SPACES_SECRET: process.env.DO_SPACES_SECRET,
        DO_SPACES_BUCKET: process.env.DO_SPACES_BUCKET,
        DO_SPACES_ORIGIN: process.env.DO_SPACES_ORIGIN,
      },
    },
  };
}

const ProfilePage = dynamic(
  () => import("../../src/pages/profile/ProfilePage"),
  {
    ssr: true,
  }
);
const ProfilePages = ({ data }) => {
  const livepeerClient = createReactClient({
    provider: studioProvider({
      apiKey: data.API_KEY,
    }),
  });
  return (
    <LivepeerConfig client={livepeerClient}>
      <ProfilePage
        props={{
          DO_SPACES_ID: data.DO_SPACES_ID,
          DO_SPACES_SECRET: data.DO_SPACES_SECRET,
          DO_SPACES_BUCKET: data.DO_SPACES_BUCKET,
          DO_SPACES_ORIGIN: data.DO_SPACES_ORIGIN,
        }}
      />
    </LivepeerConfig>
  );
};

export default ProfilePages;
