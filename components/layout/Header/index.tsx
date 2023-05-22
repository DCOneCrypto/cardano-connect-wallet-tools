
import { ModalWallet } from '@/components/common/list-wallet';
import { useAuth } from '@/hooks';
import { useWallet } from '@meshsdk/react';
import { Layout, theme, Dropdown, MenuProps, Typography } from 'antd';
import { Divider, Button, Row, Col } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import React from 'react';
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
const { useToken } = theme;
const { Text, Link, Title } = Typography;

const { Header } = Layout;
const EllipsisMiddle: React.FC<{ suffixCount: number; children: string; copy?: boolean }> = ({
    suffixCount,
    children,
    copy
}) => {
    const start = children.slice(0, suffixCount).trim();
    const suffix = children.slice(-suffixCount).trim();

    return (
        <>
            {
                copy ? <Text style={{ maxWidth: '100%' }} copyable={{ text: children }}>
                    {start}...
                </Text> :
                    <Text style={{ maxWidth: '100%' }}>
                        {start}
                    </Text>
            }
        </>
    );
};

export function HeaderLayout() {
    const { token: { colorBgContainer, colorPrimary } } = theme.useToken();

    const [openModal, setOpenModal] = useState<boolean>(false);
    const { connected, wallet, connect, disconnect, name} = useWallet();
    const [balance, setBalance] = useState<number>(0);
    const [address, setAddress] = useState<string>("")

    const { logout, nameWallet } = useAuth();
    // const lovelace = useLovelace();


    const handOpen = () => setOpenModal(true);
    const handleClose = () => {
        setOpenModal(false);
        getWallet();
    };
    useEffect(() => {
        getWallet();
        getAddress();
    }, [wallet, nameWallet, connected, name]);

    const getWallet = async () => {
        if (wallet && connected) {
            const ada = await wallet.getBalance()
            const result = ada.find((obj: any) => {
                return obj.unit === "lovelace";
            });
            if (result) {
                setBalance(result.quantity / 1000000)
            }

        } else if (nameWallet) {
            connect(nameWallet)
        }
    }
    const getAddress = async () => {
        if (connected && wallet) {
            const usedAddress = await wallet.getUsedAddresses();
            setAddress(usedAddress[0])
        }
    }
    const handleLogout = (
    ) => {
        logout();
        disconnect();
        setBalance(0);
        // router.push("/");
        setAddress("")
    };
    const items: MenuProps['items'] = [];
    const { token } = useToken();

    const contentStyle = {
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
        width: "250px"
    };

    const menuStyle = {
        boxShadow: 'none',
    };
    return (
        <>
            <Header style={{ background: colorBgContainer }} className="header-ant-design">
                {
                    connected ?
                        <Dropdown
                            trigger={['click']}
                            menu={{ items }}
                            dropdownRender={(menu) => (
                                <div style={contentStyle}>
                                    {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
                                    <Row gutter={[10, 0]} justify="space-between" style={{ padding: '16px' }}>
                                        <Col span={12}>
                                            <Title level={5}>
                                                {name.charAt(0).toUpperCase() + name.slice(1)}
                                            </Title>
                                        </Col>
                                        <Col span={12} style={{ textAlign: 'right' }}>
                                            <Text type="success">
                                                {
                                                    address.includes("addr_test") ? "Testnet" : "Mainnet"
                                                }
                                            </Text>
                                        </Col>
                                        <Col span={24}>
                                            <EllipsisMiddle suffixCount={25} copy>{address}</EllipsisMiddle>
                                        </Col>
                                        <Col span={24} >
                                            <Divider /></Col>
                                        <Col span={24}>
                                            <Button type='primary' ghost block size='large' onClick={handleLogout}><LogoutOutlined />&nbsp;Disconnect</Button>
                                        </Col>
                                    </Row>

                                </div>
                            )}
                        >
                            <Button size="large"><Link>{`${balance} ₳`}</Link> <Divider type="vertical" /> <EllipsisMiddle suffixCount={12}>{address}</EllipsisMiddle> <DownOutlined /></Button>
                        </Dropdown>
                        :
                        <Button type="primary" onClick={handOpen}>Connect Wallet</Button>
                }
            </Header>
            <ModalWallet handleClose={handleClose} open={openModal} />
        </>
    );
}