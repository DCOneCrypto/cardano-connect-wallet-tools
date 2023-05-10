import { Asset, Bundle, NextPageWithLayout, Nft, PositionForm, Properies } from "@/models";
import { MainLayout } from "components/layout";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { AddOutlined, ArrowForwardIos, Delete } from "@mui/icons-material";
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useAssets, useLovelace, useWallet } from '@meshsdk/react';
import { ModalTokenList } from "@/components/form";
import Alert from '@mui/material/Alert';
import { AlertUpdateGroup } from "@/components/common";
import { Transaction, ForgeScript } from '@meshsdk/core';
import type { Mint, AssetMetadata } from '@meshsdk/core';
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonGroup from '@mui/material/ButtonGroup';
import AddIcon from '@mui/icons-material/Add';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';


const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: 'none'
}));


const Nfts: NextPageWithLayout = () => {
    const { connected, wallet, error, connect, disconnect } = useWallet();
    const [quantity, setQuantity] = useState<number>(1);
    const incrementCounter = () => setQuantity(quantity + 1);
    let decrementCounter = () => {
        if(quantity>1) setQuantity(quantity - 1);
    }
    const [properties, setProPerties] = useState<Array<Properies>>([
        {
            key: '',
            value: ''
        }
    ])

    const handAddProperty = () => {
        let data = [...properties]
        data.push({
            key:'',
            value:''
        })
        setProPerties(data)
    }
    const removeFields = (index: number) => {
        let data = [...properties];
        data.splice(index, 1)
        setProPerties(data)
      }


    const handMint = async () => {

        // prepare forgingScript
        const usedAddress = await wallet.getUsedAddresses();
        const address = usedAddress[0];
        const forgingScript = ForgeScript.withOneSignature(address);

        const tx = new Transaction({ initiator: wallet });

        // define asset#1 metadata
        const assetMetadata1: AssetMetadata = [{
            "name": "Mesh Token1",
            "image": "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
            "mediaType": "image/jpg",
            "description": "This NFT is minted by Mesh (https://meshjs.dev/)."
        }, {
            "name": "Mesh Token2",
            "image": "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
            "mediaType": "image/jpg",
            "description": "This NFT is minted by Mesh (https://meshjs.dev/)."
        }];
        const asset1: Mint = {
            assetName: 'MeshToken',
            assetQuantity: '1',
            metadata: assetMetadata1,
            label: '721',
            recipient: 'addr_test1qzhgsynvfl8rg0w2e4ffyuqp09u57n75syp98hkwrz2pvu7xeufqpvn0vv4zgnc8knhp68h68ax4hfvdm5denk3mdzkq6ksrun',
        };
        tx.mintAsset(
            forgingScript,
            asset1,
        );

        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
        console.log(txHash)
    }
    return (
        <>
            <Card variant="outlined" sx={{ border: 'none' }}>
                <CardContent>
                    <AlertUpdateGroup show={!connected} />
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={0}
                    >
                        <Card variant="outlined">
                            <CardHeader
                                title={<Typography variant="h4" component="div">
                                    Mint Token
                                </Typography>}
                            />
                            <CardContent>
                                <Stack
                                    direction="column"
                                    justifyContent="flex-start"
                                    alignItems="flex-start"
                                    spacing={2}
                                >
                                    <TextField
                                        required
                                        label="Asset Name"
                                        fullWidth
                                        name="name"
                                    />
                                    <TextField
                                        required
                                        label="Description"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        name="description"
                                    />

                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        spacing={2}
                                    >
                                        <div>Quantity:</div>
                                        <ButtonGroup size="small" aria-label="small button group">
                                            <Button variant="outlined" size="small" onClick={decrementCounter}><HorizontalRuleIcon fontSize="small" /></Button>
                                            <Button key="two" sx={{ fontWeight: "bold" }}>{quantity}</Button>
                                            <Button variant="outlined" size="small" onClick={incrementCounter}><AddIcon fontSize="small" /></Button>
                                        </ButtonGroup>
                                    </Stack>

                                    <Button variant="contained" component="label">
                                        Asset Image *
                                        <input hidden accept="image/*" multiple type="file" />
                                    </Button>

                                    {
                                        properties.map((value, index) => 
                                            <Stack
                                                direction="row"
                                                justifyContent="flex-start"
                                                alignItems="flex-start"
                                                spacing={0}
                                                key={index}
                                            >
                                                <TextField
                                                    label="Property Name"
                                                    fullWidth
                                                    size="small"
                                                    helperText="Ex. Background"
                                                    name="key"
                                                    value={value.key}
                                                />
                                                <TextField
                                                    label="Property Value"
                                                    fullWidth
                                                    size="small"
                                                    helperText="Ex. Yellow"
                                                    key="value"
                                                    value={value.value  }
                                                />

                                                <IconButton aria-label="delete" disabled={properties.length>1?false:true} onClick={()=>{removeFields(index)}}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        )
                                    }

                                    <Button variant="outlined" endIcon={<AddOutlined />} sx={{ width: '100%', marginTop: 3 }} onClick={handAddProperty}>
                                        Add Property
                                    </Button>
                                </Stack>



                            </CardContent>
                            <CardActions sx={{ mb: 5 }}>
                                <Button variant="contained" size="small" fullWidth >Reset</Button>
                                <Button variant="contained" size='small' onClick={handMint} fullWidth>Submit</Button>
                            </CardActions>
                        </Card>
                    </Stack>



                </CardContent>

            </Card>
            {/* <ModalTokenList open={openModal} handleClose={handCloseModal} assets={array_assets} /> */}
        </>

    );
}
Nfts.Layout = MainLayout
export default Nfts