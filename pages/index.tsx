import { Asset, Bundle, NextPageWithLayout, Nft, PositionForm } from "@/models";
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
import { Transaction } from "@meshsdk/core";
import Alert from '@mui/material/Alert';
import { AlertUpdateGroup } from "@/components/common";


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  boxShadow: 'none'
}));


const Home: NextPageWithLayout = () => {
  const { connected, wallet, error, connect, disconnect } = useWallet();
  const [balance, setBalance] = useState<number>(0)
  const initBundle = () => {
    const bundle: Bundle = {
      address: '', nfts: [
        {
          type: 'ada',
          balance: 0,
          name: 'ada',
          unit: '',
          quantity_default: balance
        }
      ]
    }
    return bundle
  }
  const assets = useAssets();
  const [positionForm, setPositionForm] = useState<PositionForm>()
  const [inputFields, setInputFields] = useState<Array<Bundle>>([initBundle()])
  const [array_assets, setAssets] = useState<Array<Asset>>(new Array<Asset>)
  useEffect(() => {
    refresh_assets()
    getWallet()
    console.log("conne---", connected)
  }, [assets, wallet, connected])

  const refresh_assets = () => {
    if (assets) {
      let arr: any[] = []
      assets.forEach((item: any) => {
        arr.push({
          assetName: item.assetName,
          quantity: item.quantity,
          unit: item.unit
        })
      })
      setAssets(arr)
    }
  }

  const addFields = () => {
    const newfield: Bundle = {
      address: '', nfts: [
        {
          type: 'ada',
          balance: 0,
          name: '',
          unit: '',
          quantity_default: balance
        }
      ]
    }

    setInputFields([...inputFields, newfield])
  }

  const removeFields = (index: number) => {
    let data = [...inputFields];
    data.splice(index, 1)
    setInputFields(data)
  }
  const removeNftFields = (index: number, key: number) => {
    let data = [...inputFields];
    data[index].nfts.splice(key, 1)
    setInputFields(data)
  }

  const addNft = (index: number) => {
    let data = [...inputFields];
    const nfts: Array<Nft> = data[index].nfts
    if (nfts.filter(x => x.type == 'ada').length > 0) {
      let asset_unit_exists: Array<string> = []
      nfts.forEach(item => {
        if (item.type != 'ada') {
          asset_unit_exists.push(item.unit)
        }
      })
      const new_arr_assets = array_assets.filter(x => !asset_unit_exists.includes(x.unit))
      setAssets(new_arr_assets)
      setPositionForm({ parent: index, child: -1 })
      setOpenModal(true)
    } else {
      let obj = data[index]
      obj.nfts.push({ type: 'ada', balance: 0, name: 'ada', unit: '', quantity_default: balance })
      setInputFields(data)
    }
  }

  const handleFormChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    let data = [...inputFields];
    data[index].address = event.target.value;
    setInputFields(data);
  }

  const handleFormChangeNft = (index: number, event: any, key: number) => {
    let data = [...inputFields];
    const nft_current: Nft = data[index].nfts[key]
    if (nft_current.type === 'nft') {
      let nfts: any[] = []
      for (let i = 0; i < data.length; i++) {
        if (i == key) {
          continue
        }
        nfts = nfts.concat(data[i].nfts.filter(x => x.type == 'nft' && x.unit == nft_current.unit))
      }
      const total_balance = nfts.reduce((n, { balance }) => Number(n) + Number(balance), 0) + Number(event.target.value)
      if (nft_current.quantity_default < total_balance) {
        data[index].nfts[key].error = true
      } else {
        data[index].nfts[key].error = false
        data[index].nfts[key].balance = event.target.value
      }
    } else {
      let nfts: Nft[] = []
      for (let i = 0; i < data.length; i++) {
        if (i == key) {
          continue
        }
        nfts = nfts.concat(data[i].nfts.filter(x => x.type == 'ada'))
      }
      const total_balance = nfts.reduce((n, { balance }) => Number(n) + Number(balance), 0) + Number(event.target.value)
      if (balance < total_balance) {
        data[index].nfts[key].error = true
      } else {
        data[index].nfts[key].error = false
        data[index].nfts[key].balance = event.target.value
      }
    }
    setInputFields(data);
  }
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handCloseModal = (asset: Asset) => {
    setOpenModal(false);
    if (positionForm && positionForm.child != -1 && asset?.assetName) {
      let data = [...inputFields];
      data[positionForm.parent].nfts[positionForm.child].name = asset.assetName
      data[positionForm.parent].nfts[positionForm.child].type = "nft"
      data[positionForm.parent].nfts[positionForm.child].unit = asset.unit
      data[positionForm.parent].nfts[positionForm.child].quantity_default = asset.quantity
      setInputFields(data)
      refresh_assets()
    } else if (asset?.assetName && positionForm) {
      let data = [...inputFields]
      let obj = data[positionForm.parent]
      obj.nfts.push({ type: 'nft', balance: 0, name: asset.assetName, unit: asset.unit, quantity_default: asset.quantity })
      setInputFields(data)
    }
  }
  const handOpenModal = (parent: number, child: number) => {
    setPositionForm({
      parent: parent,
      child: child
    })
    let data = [...array_assets]
    const nfts: Array<Nft> = inputFields[parent].nfts
    let asset_unit_exists: Array<string> = []
    nfts.forEach(item => {
      if (item.type != 'ada') {
        asset_unit_exists.push(item.unit)
      }
    })
    const new_arr_assets = data.filter(x => !asset_unit_exists.includes(x.unit))
    setAssets(new_arr_assets)
    setOpenModal(true)
  }


  const handReset = () => {
    setInputFields([initBundle()])
    refresh_assets();
  }
  const lovelace = useLovelace();
  const getWallet = async () => {
    if (wallet && connected) {
      const ada = await wallet.getBalance()
      const result = ada.find((obj: any) => {
        return obj.unit === "lovelace";
      });
      if (result) {
        setBalance(result.quantity / 1000000)
      }
    }
  }

  const handSubmit = async () => {
    console.log(inputFields)
    try {
      let is_valid = false
      const tx = new Transaction({ initiator: wallet });
      for (const recipient of inputFields) {
        const adas: Array<Nft> = recipient.nfts.filter(x => x.type === 'ada' && Number(x.balance) > 0)
        if (adas && adas.length > 0) {
          tx.sendLovelace(
            { address: recipient.address },
            `${adas[0].balance.toString()}000000`
          );
        }
        const nfts: Array<Nft> = recipient.nfts.filter(x => x.type === 'nft' && Number(x.balance) > 0)
        if((adas && adas.length > 0) || (nfts && nfts.length>0)){
          is_valid = true
        }
        if (nfts && nfts.length > 0) {
          let assets: any[] = [];
          for (const asset of nfts) {
            let thisAsset = {
              unit: asset.unit,
              quantity: `${asset.balance.toString()}`,
            };
            assets.push(thisAsset);
          }
          tx.sendAssets({ address: recipient.address }, assets);
        }
      }
      console.log(tx)
      if(!is_valid){
        console.log("not found quantity")
        return
      }
      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      if(txHash){
        handReset();
        window.open(`https://preprod.cardanoscan.io/transaction/${txHash}`, '_blank', 'noopener,noreferrer')
      }
      console.log(txHash)
    } catch (error) {

    }
  }
  return (
    <>
      <Card variant="outlined" sx={{ border: 'none' }}>
        <CardHeader
          title={<Typography variant="h4" component="div">
            Gửi
          </Typography>}
          subheader="Gửi ada cho nhiều ví, token, nft"
        />
        <CardContent>
          <AlertUpdateGroup show={!connected}/>
          <Box
            component="form"
            autoComplete="off"
          >
            {inputFields.map((input, index) => {
              return (
                <Card variant="outlined" key={index} sx={{ marginTop: 2 }}>
                  <CardHeader
                    action={inputFields.length > 1 &&
                      <IconButton onClick={() => removeFields(index)}>
                        <Delete />
                      </IconButton>
                    }
                    title={<Typography variant="h6" component="div">
                      Bundle {index + 1}
                    </Typography>}
                  // subheader="September 14, 2016"
                  />
                  <CardContent>
                    <TextField required label="Recipient's address" variant="outlined" fullWidth name='address'
                      placeholder='Address'
                      size='small'
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFormChange(index, event)}
                      value={input.address} />

                    <Grid container spacing={1} sx={{ marginTop: 2 }}>
                      {
                        input.nfts.map((value, key) => (
                          <Grid item key={key}>
                            <Paper>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                spacing={0}
                                width={250}
                                height={100}
                              >
                                <Item sx={{ overflow: 'hidden' }}>
                                  <Button endIcon={<ArrowForwardIos />} onClick={() => handOpenModal(index, key)}>
                                    <Typography variant="h5" noWrap>
                                      {value.type == 'nft' ? value.name : 'ada'}
                                    </Typography>
                                  </Button>

                                  <Typography variant="caption" display="block">
                                    Total: {value.type == 'ada' ? balance.toLocaleString().split(".")[0] : value.quantity_default}
                                  </Typography>
                                </Item>
                                <Item sx={{ width: 100 }}>
                                  {
                                    input.nfts.length > 1 &&
                                    <IconButton onClick={() => removeNftFields(index, key)} sx={{ top: '-10px', left: '35px' }}>
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  }
                                  <TextField required variant="standard"
                                    name="nft"
                                    value={value.balance}
                                    onChange={event => handleFormChangeNft(index, event, key)}
                                    type='number'
                                    sx={{ marginTop: input.nfts.length > 1 ? '-10px' : '22px' }}
                                    helperText={value?.error ? 'Insufficient balance' : ''}
                                    error={value?.error ? true : false}
                                  />
                                </Item>
                              </Stack>
                            </Paper>
                          </Grid>
                        ))
                      }
                    </Grid>
                    <Button variant="outlined" onClick={() => addNft(index)} sx={{ marginTop: 2, width: 250 }}>
                      Add Token or Nft
                    </Button>
                  </CardContent>

                </Card>
              )
            })}

            <Button variant="outlined" endIcon={<AddOutlined />} onClick={addFields} sx={{ width: '100%', marginTop: 3 }}>
              Add bundle
            </Button>

          </Box>
        </CardContent>
        <CardActions disableSpacing
          sx={{
            alignSelf: "stretch",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            mt: 3,
          }} >
          <Button variant="contained" size="large" sx={{ mr: 2 }} onClick={handReset}>Reset</Button>
          <Button variant="contained" size='large' onClick={handSubmit} disabled={
            inputFields.filter(x => x.address === '').length > 0 ? true : false  && !connected
          }>Submit</Button>
        </CardActions>
      </Card>
      <ModalTokenList open={openModal} handleClose={handCloseModal} assets={array_assets} />
    </>

  );
}
Home.Layout = MainLayout
export default Home