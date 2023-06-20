
import { NextPageWithLayout } from "@/models";
import { MainLayout } from "components/layout";
import React from 'react';
import { Seo } from "@/components/common/seo";
import Link from "next/link";
import { CaretRightOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { Collapse, theme } from 'antd';
import type { CSSProperties } from 'react';
import ReactPlayer from 'react-player/youtube'

const text = `{{YOUR IPFS HASH}}`;

const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
    {
        key: '1',
        label: 'Why use send multiple ada, token through our many wallets',
        children: <p>
            Because it's simple to operate, easy to use, and cost-effective and currently some of the big wallets don't have such as nami yoroid currently only eterl.
        </p>,
        style: panelStyle,
    },
    {
        key: '2',
        label: 'How send many Nfts, Token?',
        children: <ReactPlayer url='https://youtu.be/dfLamXmdsfo' width="inherit"/>,
        style: panelStyle,
    },
    {
        key: '3',
        label: 'How Mint Nft, Token?',
        children: <ReactPlayer url='https://youtu.be/8iLJBM2NkRA' width="inherit"/>,
        style: panelStyle,
    },
    {
        key: '4',
        label: 'Why spend 1 ada to use professional?',
        children: <p>Because it's just a fee to support the author</p>,
        style: panelStyle,
    },
    {
        key: '5',
        label: 'Why use our token generator?',
        children: <p>
            Because it will be proactive and manage the policy id without any middle man
        </p>,
        style: panelStyle,
    },
    {
        key: '6',
        label: 'Why have burn nft, token?',
        children: <p>Because convenience cut  quantity of tokens</p>,
        style: panelStyle,
    },
    {
        key: '7',
        label: 'Why use our token generator?',
        children: <p>
            Because it will be proactive and manage the policy id without any middle man
        </p>,
        style: panelStyle,
    },
    {
        key: '8',
        label: 'How can I be sure my NFT is unique?',
        children: <p>That's an excellent question.
            Your NFT will be composed on three elements. A policyID, an asset Name, a quantity.
            For NFTs, all of this components shall be a UNIQUE, otherwise it's not a NFT anymore.
            To make sure that we cannot use the same POLICY ID again in the future and potentially build another similar NFT, we are using a <Link href="https://docs.cardano.org/native-tokens/learn/#mintingpolicyexamples">Time-Locking policy. </Link>
            Long story short again: we make sure that this policyID cannot be used after the specific slot on the blockchain.
            To be fully transparent, the slot number is automatically sent with the metadata when you will receive the token.
            It's accessible in the following property of the metadata object: | mintedBeforeSlotNumber.</p>,
        style: panelStyle,
    },
    {
        key: '9',
        label: 'How can I see my NFT content?',
        children: <p>
            A NFT is token but you generally link a file with it.
            On our platform we accept images, videos, and audio files up to 15mb.
            When your transaction is confirmed, the file is automatically pinned on a IPFS node.
            It means that your file will be permanently accessible, and almost impossible to delete.
            You will receive the IPFS hash of your file in the transaction metadata.
            If you want to visualize it you can use the official IPFS gateway
            Example: <Link href="https://ipfs.io/ipfs/">https://ipfs.io/ipfs/{text}</Link>
            You can also see your minted token or NFT on pool.pm. You will find the link in the confirmation message
        </p>,
        style: panelStyle,
    },
    {
        key: '10',
        label: 'What is IPFS?',
        children: <p>
            The InterPlanetary File System (IPFS) is a protocol and peer-to-peer network for storing and sharing data in a distributed file system. IPFS uses content-addressing to uniquely identify each file in a global namespace connecting all computing devices. <Link href="https://ipfs.tech/">Check the official website.</Link>
        </p>,
        style: panelStyle,
    },
    {
        key: '11',
        label: 'How can I access a file on IPFS?',
        children: <p>
            You will receive the IPFS hash of your file in the transaction metadata.
            If you want to visualize it you can use the official IPFS gateway
            Example: <Link href="https://ipfs.io/ipfs/">https://ipfs.io/ipfs/{text}</Link>
        </p>,
        style: panelStyle,
    },
    {
        key: '12',
        label: "What's Plutus?",
        children: <p>The Plutus Platform is the smart contract platform of the Cardano blockchain. You can read more about it <Link href="https://docs.cardano.org/plutus/learn-about-plutus/">here</Link>.        </p>,
        style: panelStyle,
    },
    {
        key: '13',
        label: 'What is cardano?',
        children: <p>
            Cardano is a third generation block-chain platform build on the Proof-Of-Stake pattern.
            Compared to other blockchain platforms (such as Ethereum Or Polkadot) it's the first to be founded on peer-reviewed research and developed through evidence-based methods.
            https://cardano.org/.
        </p>,
        style: panelStyle,
    },
    {
        key: '14',
        label: 'What is ADA?',
        children: <p>ADA is the main asset used on the cardano blockchain.
            It's the official Crypto currency from the cardano blockchain.</p>,
        style: panelStyle,
    },
    {
        key: '15',
        label: 'What is a NFT?',
        children: <p>
            Official documentation from WIKIPEDIA:
            A non-fungible token (NFT) is a unit of data stored on a digital ledger, called a blockchain, that certifies a digital asset to be unique and therefore not interchangeable. NFTs can be used to represent items such as photos, videos, audio, and other types of digital files. Access to any copy of the original file, however, is not restricted to the buyer of the NFT. While copies of these digital items are available for anyone to obtain, NFTs are tracked on blockchains to provide the owner with a proof of ownership that is separate from copyright.
        </p>,
        style: panelStyle,
    },

];

const Docs: NextPageWithLayout = () => {
    const { token } = theme.useToken();

    const panelStyle = {
        marginBottom: 24,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
    };
    return (
        <>
            <Seo data={{
                title: "Document",
                description: "DCOne Crypto is a place where the community can receive updates from project owners, discuss and evaluate projects they are interested in. Website is built on a multi-language platform...",
                thumbnailUrl: "https://dconecrypto.finance/Common/Images/app-logo-on-dark.svg"
            }}
            />
            <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                style={{ background: token.colorBgContainer }}
                items={getItems(panelStyle)}
            />
        </>

    );
}
Docs.Layout = MainLayout
export default Docs