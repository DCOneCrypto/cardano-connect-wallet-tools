import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Transaction } from '@meshsdk/core';
import { useWallet } from '@meshsdk/react';
import { useAuth } from '@/hooks';
import { AppContext } from '@/pages/_app';
import { BlockfrostProvider } from '@meshsdk/core';
import { AppWallet } from '@meshsdk/core';
import { demoMnemonic } from '@/config';

const blockchainProvider = new BlockfrostProvider('preprodsrIncUaXn1KG93CZRnn28HNN8wrZPx5k');
const my_wallet = new AppWallet({
    networkId: 0,
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    key: {
        type: 'mnemonic',
        words: demoMnemonic,
    },
});

interface Props {
    open: boolean,
    handleClose: () => void,
    ada_buy: number
}
export default function AlertDialog({ open, ada_buy, handleClose }: Props) {
    const { wallet } = useWallet();
    const { changePoint } = useAuth();
    const { update } = React.useContext(AppContext);


    const handleBuy = async () => {
        try {
            const tx = new Transaction({ initiator: wallet })
                .sendLovelace(
                    my_wallet.getPaymentAddress(),
                    (ada_buy * 1000000).toString()
                )
            const unsignedTx = await tx.build();
            const signedTx = await wallet.signTx(unsignedTx);
            const txHash = await wallet.submitTx(signedTx);
            if (txHash) {
                changePoint(ada_buy * 10);
                update(true);
                handleClose();
            }
        } catch (error) {

        }
    };


    return (
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Đổi ADA lấy điểm
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có muốn đổi {ada_buy.toFixed(1)} ADA sẽ có được {ada_buy * 10} điểm?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Không</Button>
                    <Button onClick={handleBuy} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
    );
}