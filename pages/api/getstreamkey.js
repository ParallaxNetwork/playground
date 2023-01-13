import axios from "axios"

export default async function getstreamkey(req, res) {
    const { streamId } = req.body
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only POST requests allowed' })
    }

    const apikey = process.env.LIVEPEER_API_KEY;
    var ko = await fetch(
        `https://livepeer.studio/api/stream/${streamId}`,
        {
            method: 'GET',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apikey}`
            },
        }
    )
    const result = await ko.json()

    return res.json(result)
}