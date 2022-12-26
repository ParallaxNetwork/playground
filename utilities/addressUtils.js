export const shortAddress = (address) => {
    if (!address) return '-'
    const head = address.substring(0, 5)
    const tail = address.substring(address.length - 5)
    return head + '-' + tail
}

export const didToAddress = (did, short = false) => {
    if (!did) return ''
    const parts = did.split(':')
    return short ? shortAddress(parts[4]) : parts[4]
  }