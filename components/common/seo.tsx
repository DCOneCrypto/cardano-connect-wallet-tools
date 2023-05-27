import Head from "next/head";
import * as React from "react";

export interface SeoData {
  title: string;
  description: string;
  url?: string;
  thumbnailUrl: string;
}

export interface SeoProps {
  data: SeoData;
}
import { NextSeo } from "next-seo";

export function Seo({ data }: SeoProps) {
  const { title, description, url, thumbnailUrl } = data;

  return (
    // <Head>
    // 	<title>
    // 		{title}
    // 	</title>
    // 	<link rel="shortcut icon" href="https://dconecrypto.finance/favicon.ico" />
    // 	<meta name="title" content={title} />
    // 	<meta name="description" content={description} />

    // 	<meta content="Cardano ecosystem interface map showing all projects and dapps on the Cardano blockchain (ADA)," name="description" />
    // 	<meta content="Cardano, cardano ecosystem, cardano wallet, ada, ada cardano, cardano coin, cardano price, Haskell, Metaverse, cardano vasil hard fork, cardano tvl, muesliswap, nami wallet, cardano scan, hydra cardano" name="keywords" />
    // 	<meta content="Cardano, cardano ecosystem, cardano wallet, ada, ada cardano, cardano coin, cardano price, Haskell, Metaverse, cardano vasil hard fork, cardano tvl, muesliswap, nami wallet, cardano scan, hydra cardano" name="author" />
    // 	<meta name="generator" content="DCOne Crypto" />
    // 	<meta property="og:site_name" content="DCOne Crypto" />
    // 	<meta property="og:type" content="website" />
    // 	<meta property="og:title" content="Interactive community ecosystem map and reviews on Cardano - DCOneCrypto.finance" />
    // 	<meta property="og:description" content="Cardano ecosystem interface map showing all projects and dapps on the Cardano blockchain (ADA)," />
    // 	<meta property="og:image" content="https://uploads-ssl.webflow.com/635b615fa5453d42d64fd2aa/642686aea44b75e981c6a9fe_DCOneCrypto-Logo-New.png" />
    // 	<meta property="og:url" content="https://cardano.dconecrypto.finance/" />
    // 	<meta property="twitter:domain" content="cardano.dconecrypto.finance" />
    // 	<meta name="twitter:site" content="@DCOneCrypto" />
    // 	<meta name="twitter:creator" content="@DCOneCrypto" />
    // 	<meta name="twitter:title" content="Interactive community ecosystem map and reviews on Cardano - DCOneCrypto.finance" />
    // 	<meta name="twitter:description" content="Cardano ecosystem interface map showing all projects and dapps on the Cardano blockchain (ADA)," />
    // 	<meta name="twitter:image" content="https://uploads-ssl.webflow.com/635b615fa5453d42d64fd2aa/642686aea44b75e981c6a9fe_DCOneCrypto-Logo-New.png" />
    // 	<meta property="twitter:url" content="https://cardano.dconecrypto.finance" />
    // </Head>

    <NextSeo
      title={title}
      description="Users send multiple ADA addresses, tokens and create your own NFT, Mint, Burn with just a few clicks"
      canonical={`https://cardano.dconecrypto.finance`}
      openGraph={{
        type: "website",
        url: "https://cardano.dconecrypto.finance",
        title: `${title} | Users send multiple ADA addresses, tokens and create your own NFT, Mint, Burn with just a few clicks`,
        description: "",
        locale: "en_EN",
        images: [
          {
            url: "https://raw.githubusercontent.com/DCOneCrypto/developer-portal/main/src/data/showcase/send-multiple-tokens.png",
            width: 800,
            height: 600,
            alt: `Users send multiple ADA addresses, tokens and create your own NFT, Mint, Burn with just a few clicks ${title}`,
          },
        ],
        site_name: "cardano.dconecrypto.finance",
      }}
      twitter={{
        handle: "@DCOneCrypto",
        site: "cardano.dconecrypto.finance",
        cardType: "summary",
      }}
    />
  );
}
