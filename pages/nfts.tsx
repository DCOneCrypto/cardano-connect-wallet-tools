import { NextPageWithLayout, Properies } from "@/models";
import { MainLayout } from "components/layout";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useState } from "react";
import { IconButton } from "@mui/material";
import { AddOutlined} from "@mui/icons-material";
import CardHeader from '@mui/material/CardHeader';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { useWallet } from '@meshsdk/react';
import { AlertUpdateGroup } from "@/components/common";
import { Transaction, ForgeScript } from '@meshsdk/core';
import type { Mint, AssetMetadata } from '@meshsdk/core';
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonGroup from '@mui/material/ButtonGroup';
import AddIcon from '@mui/icons-material/Add';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const Nfts: NextPageWithLayout = () => {
    const { connected, wallet, error, connect, disconnect } = useWallet();
    const [quantity, setQuantity] = useState<number>(1);
    const incrementCounter = () => setQuantity(quantity + 1);
    const [name, setName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [file, setFile] = useState<File>()
    const [loading, setLoading] = useState<boolean>(false)
    let decrementCounter = () => {
        if (quantity > 1) setQuantity(quantity - 1);
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
            key: '',
            value: ''
        })
        setProPerties(data)
    }
    const removeFields = (index: number) => {
        let data = [...properties];
        data.splice(index, 1)
        setProPerties(data)
    }

    const handleFormChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        let data = [...properties];
        if (event.target.name === 'key') {
            data[index].key = event.target.value;
        } else {
            data[index].value = event.target.value;
        }
        setProPerties(data);
    }

    const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0 && event.target.files[0]) {
            setFile(event.target.files[0])
        }
    }

    const handReset = () => {
        setProPerties([
            {
                key: '',
                value: ''
            }
        ])
        setFile(undefined)
        setQuantity(1)
        setName('');
        setDescription('');
    }

    const handleCloseLoading = () =>{
        setLoading(false);
    }

    const handMint = async () => {
        const usedAddress = await wallet.getUsedAddresses();
        const address = usedAddress[0];
        const forgingScript = ForgeScript.withOneSignature(address);

        const tx = new Transaction({ initiator: wallet });

        let propety: any = {}
        if (properties.length > 0) {
            for (const item of properties) {
                propety[item.key] = item.value
            }
        }
        console.log(propety)
        // define asset#1 metadata
        if (file) {
            const formData: FormData = new FormData();
            formData.append('file', file)
            setLoading(true)
            try {
                const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
                    method: 'POST',
                    headers: {
                        'pinata_api_key': `${process.env.NEXT_PUBLIC_API_KEY}`,
                        'pinata_secret_api_key': `${process.env.NEXT_PUBLIC_API_SECRET}`,
                        'Accept': 'application/json'
                    },
                    body: formData
                })
                const result = await response.json()
                if (result && result["IpfsHash"]) {
                    setLoading(false);
                    propety["image"] = `ipfs://${result["IpfsHash"]}`
                    propety["mediaType"] = file?.type
                    
                }
            } catch (error) {
                setLoading(false)
            }
        }
        const assetMetadata: AssetMetadata = {
            "name": name,
            "description": description,
            ...propety
        };
        const asset1: Mint = {
            assetName: name,
            assetQuantity: quantity.toString(),
            metadata: assetMetadata,
            label: '721',
            recipient: address
        };
        tx.mintAsset(
            forgingScript,
            asset1,
        );

        try {
            const unsignedTx = await tx.build();
            const signedTx = await wallet.signTx(unsignedTx);
            const txHash = await wallet.submitTx(signedTx);
            if(txHash){
                window.open(`https://preprod.cardanoscan.io/transaction/${txHash}`, '_blank', 'noopener,noreferrer')
            }
            console.log(txHash)
        } catch (error) {
            console.log("ERROR_MINT_NFT:", error)
        }
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
                                        value={name}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setName(event.target.value)
                                        }}
                                    />
                                    <TextField
                                        required
                                        label="Description"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        name="description"
                                        value={description}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setDescription(event.target.value)
                                        }}
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
                                        <input hidden accept="image/*" multiple type="file" onChange={handleFile} />
                                    </Button>

                                    {
                                        file && <Typography variant="caption">{file.name}</Typography>
                                    }

                                    {
                                        properties.map((value, index) =>
                                            <Stack
                                                direction="row"
                                                justifyContent="flex-start"
                                                alignItems="flex-start"
                                                spacing={1}
                                                key={index}
                                            >
                                                <TextField
                                                    label="Property Name"
                                                    fullWidth
                                                    size="small"
                                                    helperText="Ex. Background"
                                                    name="key"
                                                    value={value.key}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFormChange(index, event)}
                                                />
                                                <TextField
                                                    label="Property Value"
                                                    fullWidth
                                                    size="small"
                                                    helperText="Ex. Yellow"
                                                    key="value"
                                                    value={value.value}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFormChange(index, event)}
                                                />

                                                <IconButton aria-label="delete" disabled={properties.length > 1 ? false : true} onClick={() => { removeFields(index) }}>
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
                                <Button variant="contained" size="small" fullWidth onClick={handReset}>Reset</Button>
                                <Button
                                    disabled={!name || !description}
                                    variant="contained" size='small' onClick={handMint} fullWidth>Submit</Button>
                            </CardActions>
                        </Card>
                    </Stack>
                </CardContent>

            </Card>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
                onClick={handleCloseLoading}
            >
                <CircularProgress color="inherit" />
                </Backdrop>
            </>

            );
}
            Nfts.Layout = MainLayout
            export default Nfts