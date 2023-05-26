import { NextPageWithLayout, Properies, redirect_scan, DCOneProperty } from "@/models";
import { MainLayout } from "components/layout";
import { useState } from "react";
import { useWallet } from '@meshsdk/react';
import { AlertUpdateGroup } from "@/components/common";
import { Transaction, ForgeScript } from '@meshsdk/core';
import type { Mint, AssetMetadata } from '@meshsdk/core';
import { Col, Row } from 'antd';
import { Card, Space } from 'antd';
import { Button, Form, Input } from 'antd';
import { Radio, Switch, Typography, Tooltip } from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload, Spin, InputNumber } from 'antd';
import { ADDRESS_TESTNET } from "@/models/constants";
import { Seo } from "@/components/common/seo";
const { Text } = Typography
let FEE = `${process.env.NEXT_PUBLIC_COST_PRICE}` || "1"


const Mint: NextPageWithLayout = () => {
    const { connected, wallet } = useWallet();
    const [quantity, setQuantity] = useState<number>(1);
    // const incrementCounter = () => setQuantity(quantity + 1);
    const [file, setFile] = useState<File>()
    const [loading, setLoading] = useState<boolean>(false)
    // let decrementCounter = () => {
    //     if (quantity > 1) setQuantity(quantity - 1);
    // }
    const [royalty, setRoyalty] = useState<boolean>(false)

    const [properties, setProPerties] = useState<Array<Properies>>(DCOneProperty)

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

    // const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.files && event.target.files.length > 0 && event.target.files[0]) {
    //         setFile(event.target.files[0])
    //     }
    // }

    const handReset = () => {
        setProPerties(DCOneProperty)
        setFile(undefined)
        setQuantity(1)
    }

    const handleCloseLoading = () => {
        setLoading(false);
    }

    const handMint = async (values: any) => {
        console.log(values)
        const usedAddress = await wallet.getUsedAddresses();
        const address = usedAddress[0];
        const forgingScript = ForgeScript.withOneSignature(address);

        const tx = new Transaction({ initiator: wallet });

        let property: any = {}

        for (const item of properties) {
            if (!item.key) {
                continue
            }
            property[item.key] = item.value
        }

        console.log(property)
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
                    property["image"] = `ipfs://${result["IpfsHash"]}`
                    // property["mediaType"] = "image/jpeg"
                    // console.log(file)

                }
            } catch (error) {
                setLoading(false)
            }
        }
        setLoading(false);
        const assetMetadata: AssetMetadata = {
            name: values.name,
            description: values.description,
            // ticker: "Update",
            // decimals: 100,
            // src: property["image"],
            ...property
        };
        const asset1: Mint = {
            assetName: values.name,
            assetQuantity: values.quantity.toString(),
            metadata: assetMetadata,
            label: values.type_token,
            recipient: address,
        };


        let address_cost = `${process.env.NEXT_PUBLIC_ADDRESS}`;

        if (address.includes("addr_test")) {
            address_cost = `${process.env.NEXT_PUBLIC_ADDRESS_TEST}` || ADDRESS_TESTNET
        }
        console.log("address_cost----", royalty, address_cost)

        if (royalty) {
            tx.sendLovelace(
                address_cost,
                `${FEE}000000`
            );
            tx.setMetadata(0, 'From Tools https://cardano.dconecrypto.finance');
        }
        tx.mintAsset(
            forgingScript,
            asset1,
        );

        try {
            const unsignedTx = await tx.build();
            const signedTx = await wallet.signTx(unsignedTx);
            const txHash = await wallet.submitTx(signedTx);
            if (txHash) {
                redirect_scan(txHash, address)
                // window.open(`https://preprod.cardanoscan.io/transaction/${txHash}`, '_blank', 'noopener,noreferrer')
                // handReset()
            }
            console.log(txHash)
        } catch (error) {
            console.log("ERROR_MINT_NFT:", error)
        }
    }

    const props: UploadProps = {
        beforeUpload(file) {
            setFile(file)
        },
    };

    const onFinish = (values: any) => {
        handMint(values)
    };


    const onChangePro = (checked: boolean) => {
        setRoyalty(checked)
        let data = [...properties]
        const arr = data.filter(x => !x.disable)
        if (checked) {
            setProPerties(arr)
        } else {
            setProPerties([...DCOneProperty, ...data])
        }
    };
    const formItemLayout = {
        labelCol: {
          xs: { span: 5 },
          sm: { span: 5},
        },
        wrapperCol: {
          xs: { span: 19 },
          sm: { span: 19 },
        },
      };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 24,
                offset: 0,
            },
        },
    };
    return (
        <>
          <Seo data={{
      title: "Mint NFTs/Token",
      description: "DCOne Crypto is a place where the community can receive updates from project owners, discuss and evaluate projects they are interested in. Website is built on a multi-language platform...",
      thumbnailUrl: "https://dconecrypto.finance/Common/Images/app-logo-on-dark.svg"
    }}
    />
        <Spin spinning={loading} delay={500}>
            <Row justify="center">
                <Col xs={24} sm={12} >
                    <AlertUpdateGroup show={!connected} />
                    <Card title="Mint NFTs/Token">
                        <Form
                            {...formItemLayout}
                            id="myForm"
                            name="basic"
                            onFinish={onFinish}
                            // onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            initialValues={{ type_token: '721' }}
                        >
                            <Form.Item
                                name="name"
                                label="Asset Name"
                                rules={[{ required: true, message: 'Please input your asset name!' }]}
                            >
                                <Input placeholder="Asset Name *" />
                            </Form.Item>

                            <Form.Item name="description" label="Description">
                                <Input.TextArea placeholder="Description" />
                            </Form.Item>

                            <Form.Item
                                {...tailFormItemLayout}
                                name="quantity"
                                label="Quantity"
                                rules={[{ required: true, message: 'Please input the quantity!' }]}
                            >
                                <InputNumber min={1} placeholder="Quantity" />
                            </Form.Item>

                            <Form.Item name="type_token">
                                <Radio.Group>
                                    <Radio value="721"> Non fungible asset (721) </Radio>
                                    <Radio value="20"> Fungible asset (20) </Radio>
                                </Radio.Group>
                            </Form.Item>


                            <Space direction="vertical" style={{ marginBottom: '10px' }}>
                                <Upload {...props} maxCount={1}>
                                    <Button icon={<UploadOutlined />}>Asset Image *</Button>
                                </Upload>
                            </Space>

                        </Form>

                        <Space style={{ margin: '10px 0' }}>
                            <Text>Professional ({FEE} ada): <Tooltip title="Pro will remove royalty"><InfoCircleOutlined /></Tooltip> </Text>
                            <Switch onChange={onChangePro} checked={royalty} />
                        </Space>

                        {
                            properties.map((value, index) =>
                                <Row gutter={16} style={{ marginTop: '10px' }} key={index}>
                                    <Col span={11}>
                                        <Input name="key" placeholder="Property Name" value={value.key}
                                            disabled={value?.disable}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFormChange(index, event)} />
                                    </Col>
                                    <Col span={11}>
                                        <Input name="value" placeholder="Property Value" value={value.value}
                                            disabled={value?.disable}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFormChange(index, event)} />
                                    </Col>
                                    <Col span={2}>
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            disabled={value?.disable ? true : false}
                                            onClick={() => { removeFields(index) }}>
                                        </Button>
                                    </Col>
                                </Row>

                            )}

                        <Row gutter={[16, 20]} style={{ marginTop: '20px' }}>
                            <Col span={24}>
                                <Button block onClick={handAddProperty}>Add Property <PlusOutlined /></Button>
                            </Col>
                            <Col span={12}>
                                <Button block onClick={handReset}>Reset</Button>
                            </Col>
                            <Col span={12}>
                                <Button type="primary" htmlType="submit" block form="myForm" disabled={!connected}>
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Spin>

        </>

    );
}
Mint.Layout = MainLayout
export default Mint