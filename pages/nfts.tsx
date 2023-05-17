import { NextPageWithLayout, Properies } from "@/models";
import { MainLayout } from "components/layout";
import { useState } from "react";
import { useWallet } from '@meshsdk/react';
import { AlertUpdateGroup } from "@/components/common";
import { Transaction, ForgeScript } from '@meshsdk/core';
import type { Mint, AssetMetadata } from '@meshsdk/core';
import { Col, Row } from 'antd';
import { Card, Space } from 'antd';
import { Button, Form, Input } from 'antd';
import { Radio, Typography } from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload, Spin } from 'antd';

const { Text } = Typography;

const Nfts: NextPageWithLayout = () => {
    const { connected, wallet, error, connect, disconnect } = useWallet();
    const [quantity, setQuantity] = useState<number>(1);
    const incrementCounter = () => setQuantity(quantity + 1);
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
    }

    const handleCloseLoading = () => {
        setLoading(false);
    }

    const handMint = async (values: any) => {
        const usedAddress = await wallet.getUsedAddresses();
        const address = usedAddress[0];
        const forgingScript = ForgeScript.withOneSignature(address);

        const tx = new Transaction({ initiator: wallet });

        let property: any = {}
        if (properties.length > 0) {
            for (const item of properties) {
                property[item.key] = item.value
            }
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
                    property["mediaType"] = file?.type

                }
            } catch (error) {
                setLoading(false)
            }
        }
        setLoading(false);
        const assetMetadata: AssetMetadata = {
            "name": values.name,
            "description": values.description,
            ...property
        };
        const asset1: Mint = {
            assetName: values.name,
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
            if (txHash) {
                window.open(`https://preprod.cardanoscan.io/transaction/${txHash}`, '_blank', 'noopener,noreferrer')
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
        // onChange(info: any) {
        //     // setFile(info.file)
        //     console.log(info, typeof(info.file))
        // },
    };

    const onFinish = (values: any) => {
        handMint(values)
    };

    return (
        <><Spin spinning={loading} delay={500}>
            <Row>
                <Col span={12} offset={6}>
                    <AlertUpdateGroup show={!connected} />
                    <Card title="Mint token">
                        <Form
                            id="myForm"
                            name="basic"
                            onFinish={onFinish}
                            // onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                name="name"
                                rules={[{ required: true, message: 'Please input your asset name!' }]}
                            >
                                <Input placeholder="Asset Name *" />
                            </Form.Item>

                            <Form.Item name="description">
                                <Input.TextArea placeholder="Description" />
                            </Form.Item>

                            <Space direction="vertical" size="large">
                                <Space>
                                    <Text>Quantity: </Text>
                                    <Radio.Group>
                                        <Radio.Button onClick={decrementCounter}>-</Radio.Button>
                                        <Radio.Button disabled>
                                            {quantity}
                                        </Radio.Button>
                                        <Radio.Button onClick={incrementCounter}>+</Radio.Button>
                                    </Radio.Group>
                                </Space>

                                <Space direction="vertical">
                                    <Upload {...props} maxCount={1}>
                                        <Button icon={<UploadOutlined />}>Asset Image *</Button>
                                    </Upload>
                                </Space>

                            </Space>


                        </Form>

                        {
                            properties.map((value, index) =>
                                <Row gutter={16} style={{ marginTop: '10px' }} key={index}>
                                    <Col span={11}>
                                        <Input name="key" placeholder="Property Name" value={value.key}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFormChange(index, event)} />
                                    </Col>
                                    <Col span={11}>
                                        <Input name="value" placeholder="Property Value" value={value.value}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFormChange(index, event)} />
                                    </Col>
                                    <Col span={2}><Button danger icon={<DeleteOutlined />} disabled={properties.length > 1 ? false : true} onClick={() => { removeFields(index) }}></Button></Col>
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
Nfts.Layout = MainLayout
export default Nfts