import { useEffect } from 'react';
import { Modal, List, Avatar, Alert } from 'antd';

import { useWallet } from '@meshsdk/react';
import { useWalletList } from '@meshsdk/react';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/router';

interface Prop {
    open: boolean,
    handleClose: () => void,
}
export function ModalWallet(props: Prop) {
    const router = useRouter()
    const { open, handleClose } = props;

    const { connected, wallet, connect, error, name } = useWallet();
    const { login, nameWallet } = useAuth()

    const wallets = useWalletList();

    useEffect(() => {
        if (connected && open) {
            login(name);
            handleClose();
        }
    }, [wallet, nameWallet])

    const handConnect = (name: string) => {
        connect(name);
    }

    return (
        <Modal title="Connect Wallet" open={open} footer={null} width={300} onCancel={handleClose}>
            <List
                itemLayout="horizontal"
                dataSource={wallets}
                renderItem={(item, index) => (
                    <List.Item onClick={() => handConnect(item.name)}>
                        <List.Item.Meta
                            avatar={<Avatar src={item.icon} />}
                        />
                        <div>{item.name}</div>
                    </List.Item>
                )}
            >
                {
                    error ? <List.Item >
                        <Alert message="The request was refused due to lack of access - e.g. wallet disconnects." type="error" showIcon />
                    </List.Item> : ''
                }
            </List>
        </Modal>
    );
}