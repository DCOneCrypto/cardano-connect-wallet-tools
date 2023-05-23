import { NextPageWithLayout } from "@/models";
import { MainLayout } from "components/layout";
import { useState } from "react";
import { useAssets, useWallet } from '@meshsdk/react';
import { AlertUpdateGroup } from "@/components/common";
import { Col, Row } from 'antd';
import { Button } from 'antd';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ModalBurnToken } from "@/components/form";


const Burn: NextPageWithLayout = () => {
    const assets = useAssets();
    const { connected} = useWallet();
    const [openModalBurn, setOpenModalBurn] = useState<boolean>(false);
    const [asset, setAsset] = useState<any>();
  
    const handRow = (record: any) => {
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
                <Button danger size="middle" onClick={()=>{handRow(record)}}>
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
                <Col span={24} style={{textAlign:'right'}}>
                <Button href="/mint" type="primary">Mint NFTs/Token</Button>
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