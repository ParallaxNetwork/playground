import axios from "axios";
import { isEmpty } from "lodash";

export const lockMeta = async (chain, lockAddress) => {
    if (isEmpty(chain) || chain == undefined) {
        chain = {
            id: process.env.NEXT_PUBLIC_CHAIN_ID
        }

    }
    let data = {};
    let config = {
        method: "GET",
        url: `https://locksmith.unlock-protocol.com/v2/api/metadata/${chain.id}/locks/${lockAddress}`,

        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        data: data,
    };

    const response = await axios(config);

    return response.data;
};