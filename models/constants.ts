export const STORAGE_KEY = {
  NAME_WALLET: "name_wallet"
};
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined'
}

export const nextLocalStorage = (): Storage | void => {
  if (isBrowser()) {
    return window.localStorage
  }
}
export const ADDRESS_TESTNET = "addr_test1qqgtl9aqvep7v4ufv05d0cq8vjgy5lxxh9t99kyt664kmmd3mhsvtcr3l8g96q2nsqxus26jjcj8z3e3pe58ueu7q4asn6zlsd"