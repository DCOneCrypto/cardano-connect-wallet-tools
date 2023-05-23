import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { ArrowRightOutlined, FileImageOutlined, UnlockOutlined } from '@ant-design/icons';

export interface LayoutProps{
    children: ReactNode // react node có thể là number, string, null
    window?: () => Window;
}

export type NextPageWithLayout = NextPage & {
    Layout ?: (props: LayoutProps) => ReactElement
}

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export const listMenu = [
    {
      name: "Send Multiple", link: "/", icon: ArrowRightOutlined
    },
    {
      name: "NFTs/Token", link: "/burn", icon: FileImageOutlined
    }
  ]

export function redirect_scan(txHash: string, address: string){
  if(address.includes("addr_test")){
    window.open(`https://preprod.cardanoscan.io/transaction/${txHash}`, '_blank', 'noopener,noreferrer')
  }else{
    window.open(`https://cardanoscan.io/transaction/${txHash}`, '_blank', 'noopener,noreferrer')
  }
}