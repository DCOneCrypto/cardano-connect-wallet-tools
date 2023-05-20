
import { ModalWallet } from '@/components/common/list-wallet';
import { useAuth } from '@/hooks';
import { useWallet } from '@meshsdk/react';
import { Layout, theme, Space, Avatar, Dropdown, MenuProps } from 'antd';
import { Col, Button, Row } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
const { Header } = Layout;

export function HeaderLayout() {
    const { token: { colorBgContainer, colorPrimary } } = theme.useToken();

    const [openModal, setOpenModal] = useState<boolean>(false);
    const { connected, wallet, error, connect, disconnect } = useWallet();
    const [balance, setBalance] = useState<number>(0);

    const { name, logout } = useAuth();
    const router = useRouter()
    // const lovelace = useLovelace();


    const handOpen = () => setOpenModal(true);
    const handleClose = () => {
        setOpenModal(false);
        getWallet();
    };
    useEffect(() => {
        getWallet();
    }, [wallet, name]);

    const getWallet = async () => {
        if (wallet && connected) {
            const ada = await wallet.getBalance()
            const result = ada.find((obj: any) => {
                return obj.unit === "lovelace";
            });
            if (result) {
                setBalance(result.quantity / 1000000)
            }
        } else if (name) {
            connect(name)
        }
    }
    const handleLogout = (
    ) => {
        logout();
        disconnect();
        setBalance(0);
        router.push("/");
    };
    const items: MenuProps['items'] = [
        {
            label: `${balance.toLocaleString().split(".")[0]} ₳`,
            key: '1'
        },
        {
            type: 'divider',
        },
        {
            label: 'Logout',
            key: '3',
            onClick: handleLogout
        },
    ];

    return (
        <>
            <Header style={{ background: colorBgContainer }} className="header-ant-design">
                <div style={{ textAlign: 'right' }}>
                    {
                        connected ?
                            <Dropdown menu={{ items }} trigger={['click']}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <Avatar shape="square" style={{ backgroundColor: colorPrimary }}>A</Avatar>
                                    </Space>
                                </a>
                            </Dropdown>
                            :
                            <Button type="primary" onClick={handOpen}>Connect Wallet</Button>
                    }
                </div>
            </Header>
            <ModalWallet handleClose={handleClose} open={openModal} />
        </>
    );
}