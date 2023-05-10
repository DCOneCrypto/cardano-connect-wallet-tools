import { EmotionCache } from "@emotion/cache";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import ImageIcon from '@mui/icons-material/Image';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export interface LayoutProps{
    children: ReactNode // react node có thể là number, string, null
    window?: () => Window;
}

export type NextPageWithLayout = NextPage & {
    Layout ?: (props: LayoutProps) => ReactElement
}

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
    emotionCache?: EmotionCache
}


// export interface LayoutProps {
// 	children: ReactNode
// }

// export type NextPageWithLayout = NextPage & {
// 	Layout?: (props: LayoutProps) => ReactElement
// }

// export type AppPropsWithLayout = AppProps & {
// 	Component: NextPageWithLayout
// 	emotionCache?: EmotionCache
// }

export const listMenu = [
    {
      name: "Chuyển Token", link: "", icon: ArrowForwardIcon
    },
    {
      name: "NFTs", link: "nfts", icon: ImageIcon
    },
    {
      name: "Lock", link: "", icon: ImageIcon
    }
  ]