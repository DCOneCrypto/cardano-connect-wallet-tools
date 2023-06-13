
import { NextPageWithLayout } from "@/models";
import { MainLayout } from "components/layout";
import { Typography } from 'antd';
import React from 'react';
import { Image } from 'antd';
const { Title, Paragraph } = Typography;
import { Seo } from "@/components/common/seo";
import Link from "next/link";

const Docs: NextPageWithLayout = () => {
    return (
        <>
            <Seo data={{
                title: "Document",
                description: "DCOne Crypto is a place where the community can receive updates from project owners, discuss and evaluate projects they are interested in. Website is built on a multi-language platform...",
                thumbnailUrl: "https://dconecrypto.finance/Common/Images/app-logo-on-dark.svg"
            }}
            />
            <Typography>
                <Title>Introduction</Title>
                <Paragraph>
                    Currently there are many wallets on the Cardano blockchain platform but there are many limitations such as Nami wallet, Eternl how to send assets to multiple addresses, mint nft. To solve that problem, the DCOne Team decided to create this tool to provide users with easier manipulation with their own wallet.(Hiện nay có nhiều ví trên nền tảng blockchain cardano nhưng còn nhiều hạn chế chẳng hạn như ví nami, eternl làm sao để gửi tài sản đến nhiều địa chỉ, mint nft.
                    Để giải quyết vấn đề đó team DCOne quyết định tạo tool này cung cấp cho người dùng dễ thao tác hơn với ví của chính mình.)
                </Paragraph>
                <Title>How using?</Title>
                <Title level={2}><Link href="/" style={{ color: 'black' }}>Send many Nfts, Token</Link></Title>
                <Paragraph>
                    - Select menu send multiple
                </Paragraph>
                <div style={{ padding: '20px' }}>
                    <Image
                        src="/img/token1.jpeg"
                    />
                </div>
                <Paragraph>
                    - To send to many different addresses called bundle, in bundle you can send ada and many different tokens to the same address you want to send. (Để gửi đến nhiều địa chỉ khác nhau gọi là bundle, trong bundle có thể gửi ada và nhiều token khác nhau cho cùng địa chỉ muốn gửi)
                </Paragraph>
                <Paragraph>
                    - After entering complete information, click submit, will navigate to cardano scan to check in onchain, a transaction on cardano currently takes about 8, 9 seconds, refresh after that time, or check the change of wallet (Sau khi nhập thông tin đầy đủ, bấm vào submit, sẽ điều hướng đến cardano scan để kiểm trong onchain, một giao dịch trên cardano hiện nay khoảng 8, 9s hãy refresh sau khoảng thời gian đó, hoặc kiểm tra sự thay đổi của ví)
                </Paragraph>
                <Title level={2}><Link href="/burn" style={{ color: 'black' }}>Mint Nft, Token</Link></Title>
                <Paragraph>
                    - Select the mint menu will show a list of the number of nft, the wallet token is holding, you can burn the amount you want. (Chọn menu mint sẽ ra danh sách số lượng nft, token ví đang giữ, có thể burn số lượng bạn muốn)
                </Paragraph>
                <div style={{ padding: '20px' }}>
                    <Image
                        src="/img/mint.png"
                    />
                </div>
                <Paragraph>
                    - Generate more nft, tokens by selecting mint Nfts/Token (Tạo thêm nft, token bằng cách chọn mint Nfts/Token)
                </Paragraph>
                <Paragraph>
                    - Enter necessary information such as name, avatar, quantity, token type (Nhập thông tin cần thiết như tên, avatar, số lượng, loại token)
                </Paragraph>
                <Paragraph>
                    - By default metadata will include our team's information, if you don't like it, you can support us for 1ADA (Mặc định metadata sẽ đính kèm thông tin của team chúng tôi, nếu không thích bạn có thể ủng hộ chúng tôi với phí 1ADA)
                </Paragraph>
                <Paragraph>
                    - After entering complete information, click submit, will navigate to cardano scan to check in onchain, a transaction on cardano now takes about 8, 9 seconds, refresh after that time, or check wallet changes (Sau khi nhập thông tin đầy đủ, bấm vào submit, sẽ điều hướng đến cardano scan để kiểm trong onchain, một giao dịch trên cardano hiện nay khoảng 8, 9s hãy refresh sau khoảng thời gian đó, hoặc kiểm tra sư thay đổi của ví)
                </Paragraph>
            </Typography>
        </>

    );
}
Docs.Layout = MainLayout
export default Docs