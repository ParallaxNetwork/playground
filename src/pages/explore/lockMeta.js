import axios from "axios";

export const lockMeta = async (chain, lockAddress) => {
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