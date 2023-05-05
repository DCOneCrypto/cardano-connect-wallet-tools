import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

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

    const { connected, wallet, connect, error } = useWallet();
    const { login, name } = useAuth()
    const [nameWallet, setNameWallet] = useState<string>("");

    const wallets = useWalletList();

    useEffect(() => {
        if (connected && open && nameWallet) {
            login(nameWallet);
            handleClose();
        }
    }, [wallet, nameWallet])

    const handConnect = (name: string) => {
        setNameWallet(name)
        connect(name);
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                    Chọn ví để kết nối
                </Typography>

                <List component="nav" aria-label="item wallet">
                    {wallets.map((wallet, i) =>
                        <div key={i}>
                            <ListItem button onClick={() => handConnect(wallet.name)}>
                                <ListItemText primary={wallet.name} />
                                <ListItemAvatar>
                                    <Avatar src={wallet.icon} />
                                </ListItemAvatar>
                            </ListItem>
                            <Divider />
                        </div>
                    )}
                </List>
                <Typography>
                    {
                        error ? <Alert severity="error">Kết nối với ví thất bại, hãy thử lại hoặc kết nối với ví khác!</Alert> : ""
                    }
                </Typography>

            </Box>
        </Modal>
    );
}