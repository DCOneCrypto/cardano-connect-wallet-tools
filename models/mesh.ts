export interface Asset{
    assetName: string,
    quantity: number,
    unit: string,
    id?: number
}
export interface Nft {
    type: 'ada' | 'nft',
    balance: number,
    name: string,
    unit: string,
    error?: boolean,
    quantity_default: number
  }
  
export interface Bundle {
    address: string,
    nfts: Array<Nft>
  }
export type TypeForm = 'address' | 'nft'

export interface PositionForm {
    parent: number,
    child: number
  }
export interface Properies{
  key: string,
  value: string,
  disable?: boolean
}
export const DCOneProperty: Array<Properies>=[
  {
    key: "MinBy",
    value: "DCOne Crypto",
    disable: true
  },
  {
    key: "Website",
    value: "https://dconecrypto.finance",
    disable: true
  }
]