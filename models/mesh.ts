export interface Asset{
    assetName: string,
    quantity: number,
    unit: string
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