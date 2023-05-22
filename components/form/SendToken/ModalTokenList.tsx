import { Asset } from '@/models';
import type { ColumnsType } from 'antd/es/table';
import { Button } from 'antd';
import { Modal, Table } from 'antd';




interface Prop {
    open: boolean,
    handleClose: (obj?: any) => void,
    assets: Array<Asset>

}

// const ModalTokenList: React.FC<Prop> = (props: Prop) =>{
export function ModalTokenList(props: Prop) {
    const { open, handleClose, assets } = props;

    const columns: ColumnsType<any> = [
        {
            title: 'Ordinal',
            dataIndex: 'assetName',
            key: 'assetName',
            render: (_, record, index) => (
                <span>{index+1}</span>
            )
        },
        {
            title: 'Asset Name',
            dataIndex: 'assetName',
            key: 'assetName',
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
                <Button type="primary" size="middle" onClick={() => { handleClose(record) }}>Select</Button>
            )
        },
    ];

    return (
        <Modal
            open={open}
            title="List token & Nfts"
            footer={null}
            onCancel={handleClose}
        >
           <Table style={{marginTop: "20px"}} rowKey="unit" columns={columns} dataSource={assets} pagination={false}/>
        </Modal>
    );
}
// export default ModalTokenList