import EngagePage from "../../src/pages/engage/EngagePage"
import {
    LivepeerConfig,
    ThemeConfig,
    createReactClient,
    studioProvider,
} from "@livepeer/react";

async function getServerSideProps({ req, params }) {
    return {
        props: {
            data: {
                API_KEY: "265866e6-712c-43dd-8366-d2f823fb34c5"
            }
        }
    }
}


const EngagePages = ({ props }) => {
    const livepeerClient = createReactClient({
        provider: studioProvider({
            apiKey: props,
        }),
    });
    return <LivepeerConfig client={livepeerClient}><EngagePage /></LivepeerConfig>
}


export default EngagePages