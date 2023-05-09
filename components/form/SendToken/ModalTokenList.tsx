import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useAssets } from '@meshsdk/react';
import { Asset } from '@/models';


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};


interface Prop {
    open: boolean,
    handleClose: (obj?: any) => void,
    assets: Array<Asset>

}
export function ModalTokenList(props: Prop) {
    const { open, handleClose, assets } = props;

    const handleClick = (index: number) =>{
        handleClose(assets[index]);
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
                    Danh sách token
                </Typography>

                <TableContainer component={Paper} sx={{mt:5}}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell align="left" >Tên</TableCell>
                                <TableCell align="right">Số lượng</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                           {
                            assets && assets.map((value, index)=>{
                                return (
                                    <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                    key={index}
                                    onClick={(event) => handleClick(index)}
                                >
                                    <TableCell component="th" scope="row">
                                        {index+1}
                                    </TableCell>
                                    <TableCell>{value.assetName}</TableCell>
                                    <TableCell align="right">{value.quantity}</TableCell>
    
                                </TableRow>
                                )
                            })
                           }
                        </TableBody>
                    </Table>
                </TableContainer>

            </Box>
        </Modal>
    );
}