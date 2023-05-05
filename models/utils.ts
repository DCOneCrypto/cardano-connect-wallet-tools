import { STORAGE_KEY } from "./constants";

export class LocalStorage {

  static get accessNameWallet() {
    return localStorage.getItem(STORAGE_KEY.NAME_WALLET) || "";
  }


  static setNameWallet(name: string) {
    localStorage.setItem(STORAGE_KEY.NAME_WALLET, name);
  }

  static removeNameWallet(){
    localStorage.removeItem(STORAGE_KEY.NAME_WALLET)
  }
}

export default LocalStorage;