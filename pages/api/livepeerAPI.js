import axios from "axios"

const apikey = "265866e6-712c-43dd-8366-d2f823fb34c5";

export async function getLivePeerStream(playbackId) {
    // const apikey = process.env.LIVEPEER_API_KEY;
    try {
        const response = await axios.get(`https://livepeer.studio/api/stream`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apikey}`,
            }
        });
        const result = response.data;
        const filteredData = result.filter(item => item.playbackId === playbackId);

        return filteredData[0];
        // use the result here
    } catch (error) {
        // handle the error
        console.log(error)
    }
}

export default async function getActiveLivePeerStream() {
    try {
        const response = await axios.get(`https://livepeer.studio/api/stream?streamsonly=1&filters=[{"id": "isActive", "value": true}]`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apikey}`,
            }
        });

        const result = response.data;
        return result;
    } catch (error) {
        // handle the error
        console.log(error)
    }
}