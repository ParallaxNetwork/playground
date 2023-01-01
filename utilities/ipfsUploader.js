import { NFTStorage, File, Blob } from 'nft.storage'

export const minterKey = {
    NFT_STORAGE_MINTER_KEY:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGU5NDk1MDlmNDk0OEI0ODQ5ZTMwRjAyY0E0ODFjNTBhN2ZjYjAxMkEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MjUwNjc0NTM5NCwibmFtZSI6IlBMQVlHUk9VTkQifQ.CRtoWhpiDxSY20R-ff4ahSFtGld-5lcMpdvrPg0vntc',
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