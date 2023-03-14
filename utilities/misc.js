/* eslint-disable no-undef */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function removeNumberPostfix(string) {
  return string.replace(/\d+$/, "");
}