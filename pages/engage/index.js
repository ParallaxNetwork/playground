import {
    createReactClient, LivepeerConfig, studioProvider
} from "@livepeer/react";
import EngagePage from "../../src/pages/engage/EngagePage";

export function getServerSideProps({ req, params }) {
    return {
        props: {
            data: {
                API_KEY: process.env.LIVEPEER_API_KEY
            }
        }
    }
}


const EngagePages = ({ data }) => {
    const livepeerClient = createReactClient({
        provider: studioProvider({
            apiKey: data.API_KEY,
        }),
    });
    return <LivepeerConfig client={livepeerClient}><EngagePage /></LivepeerConfig>
}


export default EngagePages