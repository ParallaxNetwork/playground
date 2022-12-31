
import dynamic from "next/dynamic"

import {
    createReactClient, LivepeerConfig, studioProvider
} from "@livepeer/react";

export function getServerSideProps({ req, params }) {
    return {
        props: {
            data: {
                API_KEY: process.env.LIVEPEER_API_KEY
            }
        }
    }
}


const ProfilePage = dynamic(() => import('../../src/pages/profile/ProfilePage'), {
    ssr: true
})
const ProfilePages = ({ data }) => {

    const livepeerClient = createReactClient({
        provider: studioProvider({
            apiKey: data.API_KEY,
        }),
    });
    return <LivepeerConfig client={livepeerClient}><ProfilePage /></LivepeerConfig>
}


export default ProfilePages