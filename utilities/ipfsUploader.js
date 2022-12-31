import { NFTStorage, File, Blob } from 'nft.storage'

export const minterKey = {
    NFT_STORAGE_MINTER_KEY:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJENzg0YzMyNDQ1NTc5MDVlNDJCYTk0MTZjYTNlZTAwQTU3NDU0NjYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MDUwMTEwMTY3OSwibmFtZSI6Im1iby1kZXYifQ.irEG8EkZBBXPUOCwOQGchoYIQEMgXEkTOXBAZsT6N5Q',
}
export const uploadToIPFS = async (data) => {
    const client = new NFTStorage({ token: minterKey.NFT_STORAGE_MINTER_KEY })
    const cid = await client.storeDirectory(data)

    return cid
}


export const constructMeta = async ({ data, cid, dataLength, type }) => {
    let tempJSON = []
    let nftImage
    for (var i = 1; i <= dataLength; i++) {
        if (i == 1) {
            nftImage = `https://${cid}.ipfs.nftstorage.link/${i}.${type}`
        }
        const fileData = JSON.stringify({
            name: `${data.title} #${i}`,
            image: `https://${cid}.ipfs.nftstorage.link/${i}.${type}`,
            description: data.description
        })
        const blob = new Blob([fileData], { type: 'text/plain' })
        var file = new File([blob], `${i}`)
        tempJSON.push(file)
    }
    return { tempJSON, nftImage }
}