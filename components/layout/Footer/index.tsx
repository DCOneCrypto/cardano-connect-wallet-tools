
import { Layout, QRCode, Col, Row, Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
const { Content, Footer } = Layout;
import Icon from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import Link from "next/link";
import { TwitterOutlined } from "@ant-design/icons";
import { Typography } from 'antd';

const { Title, Text } = Typography;

const TelegramSvg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48"><rect width="48" height="48" fill="#419FD9" rx="24"></rect><rect width="48" height="48" fill="url(#paint0_linear)" rx="24"></rect><path fill="#fff" d="M10.7874 23.4709C17.7667 20.3663 22.4206 18.3195 24.7493 17.3305C31.3979 14.507 32.7795 14.0165 33.68 14.0002C33.878 13.9968 34.3208 14.0469 34.6077 14.2845C34.8499 14.4852 34.9165 14.7563 34.9484 14.9465C34.9803 15.1368 35.02 15.5702 34.9884 15.9088C34.6281 19.774 33.0692 29.1539 32.276 33.483C31.9404 35.3148 31.2796 35.929 30.6399 35.9891C29.2496 36.1197 28.1938 35.051 26.8473 34.1497C24.7401 32.7395 23.5498 31.8615 21.5044 30.4854C19.1407 28.895 20.673 28.0209 22.0201 26.5923C22.3726 26.2185 28.4983 20.5295 28.6169 20.0135C28.6317 19.9489 28.6455 19.7083 28.5055 19.5813C28.3655 19.4543 28.1589 19.4977 28.0098 19.5322C27.7985 19.5812 24.4323 21.8529 17.9113 26.3473C16.9558 27.0172 16.0904 27.3435 15.315 27.3264C14.4602 27.3076 12.8159 26.833 11.5935 26.4273C10.0942 25.9296 8.90254 25.6666 9.0063 24.8215C9.06035 24.3813 9.65403 23.9311 10.7874 23.4709Z"></path><defs><linearGradient id="paint0_linear" x1="24" x2="24" y2="47.644" gradientUnits="userSpaceOnUse"><stop stopColor="#2AABEE"></stop><stop offset="1" stopColor="#229ED9"></stop></linearGradient></defs></svg>
);
const TeleGramIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={TelegramSvg} {...props} />
);
import { useQRCode } from 'next-qrcode';


export function FooterLayout() {
    const { Canvas } = useQRCode();


    return (
        <Footer >
            {/* Created by Team DCOne Crypto &nbsp;
        <Link href="https://twitter.com/DCOneCrypto"><TwitterOutlined /></Link> &nbsp;
        <Link href="https://t.me/dconecrypto"><TeleGramIcon /></Link> */}
            <Row gutter={[20, 10]}>
                <Col span={24}>
                    <Link href="https://dconecrypto.finance/ecosystem-map.html" style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar size="large" src="/img/dcone_logo.jpg" alt="avatar" />
                        {/* <span style={{ marginLeft: '10px' }}>DCOne Crypto</span> */}
                        <Title level={5} style={{ marginBottom: '0' }}>DCOne Crypto</Title>
                    </Link></Col>
                <Col span={24}>DCOne Crypto is a place where the community can receive updates from project owners, discuss and evaluate projects they are interested in. Website is built on a multi-language platform...</Col>
                <Col span={24}>
                    <Link href="https://twitter.com/DCOneCrypto"><TwitterOutlined /></Link> &nbsp;
                    <Link href="https://t.me/dconecrypto"><TeleGramIcon /></Link>
                </Col>

                <Col span={12} offset={8} style={{ marginTop: '20px', marginBottom: '50px' }}>
                    <Row justify="center">
                        <Col span={12}>
                            <Title level={5}>USEFUL BUILDING</Title>
                            <ul className='footer-ul'>
                                <li>
                                    <Link href="https://meshjs.dev/">Mesh</Link> &nbsp;
                                    <Avatar size="small" src="https://meshjs.dev/logo-mesh/mesh.png" />
                                </li>
                                <li><Link href="https://nextjs.org/">Nextjs</Link> </li>
                                <li><Link href="https://ant.design/">Ant Design</Link> </li>
                            </ul>
                        </Col>
                        <Col span={12}>
                            <Title level={5}>DONATE</Title>
                            <Canvas
                                text={`${process.env.NEXT_PUBLIC_ADDRESS}`}
                                options={{
                                    level: 'M',
                                    margin: 3,
                                    scale: 4,
                                    width: 100,

                                }}
                            />
                        </Col>
                    </Row>

                </Col>
            </Row>

            <div style={{ textAlign: 'center' }}>
                Created by Team DCOne Crypto
            </div>
        </Footer>
    );
}