import { Asset, NextPageWithLayout, Properies } from "@/models";
import { MainLayout } from "components/layout";
import { useEffect, useState } from "react";
import { useAssets, useWallet } from '@meshsdk/react';
import { AlertUpdateGroup } from "@/components/common";
import { Transaction, ForgeScript } from '@meshsdk/core';
import type { Mint, AssetMetadata } from '@meshsdk/core';
import { Col, Row } from 'antd';
import { Card } from 'antd';
import { Button, Form, Input } from 'antd';
import { Radio, Typography } from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload, Spin } from 'antd';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Link from "next/link";
import { ModalBurnToken } from "@/components/form";

const { Text } = Typography;

interface DataType {
    assetName: string;
    policyId: string;
    quantity: number;
}

const Burn: NextPageWithLayout = () => {
    const assets = useAssets();
    const { connected, wallet, error, connect, disconnect } = useWallet();
    const [openModalBurn, setOpenModalBurn] = useState<boolean>(false);
    const [asset, setAsset] = useState<any>();
  
    const handRow = (record: any) => {
        console.log(record)
        setAsset(record);
        setOpenModalBurn(true);
        
    }
    const columns: ColumnsType<any> = [
        {
            title: 'AssetName',
            dataIndex: 'assetName',
            key: 'assetName',
        },
        {
            title: 'Policy',
            dataIndex: 'policyId',
            key: 'policyId',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button size="middle" onClick={()=>{handRow(record)}}>
                    Burn
                </Button>
            ),
        },
    ];

    return (
        <>
         
            <Row gutter={[20, 30]}>
                {
                    !connected && <Col span={24}><AlertUpdateGroup show={!connected} /></Col>
                }
                <Col span={24}>
                <Button href="/mint" type="primary">Mint Token</Button>
                </Col>
                <Col span={24}>
                    <Table rowKey="unit" columns={columns} dataSource={assets} pagination={false} />
                </Col>
            </Row>
            {
                asset && <ModalBurnToken open={openModalBurn} asset={asset} handleClose={()=>{
                    setOpenModalBurn(false)
                }}/>
            }
        </>

    );
}
Burn.Layout = MainLayout
export default Burn