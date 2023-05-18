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
      name: "Send", link: "/", icon: ArrowRightOutlined
    },
    {
      name: "NFTs", link: "/burn", icon: FileImageOutlined
    },
    {
      name: "Lock", link: "/lock", icon: UnlockOutlined
    }
  ]