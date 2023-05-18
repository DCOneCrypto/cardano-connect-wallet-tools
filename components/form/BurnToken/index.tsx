import { useEffect, useState } from 'react';
import { useAssets, useWallet } from '@meshsdk/react';
import { Button, Form, Input, InputNumber, Modal, Radio } from 'antd';
import { Transaction, ForgeScript } from '@meshsdk/core';
import type { Asset } from '@meshsdk/core';



interface Prop {
    open: boolean,
    handleClose: (obj?: any) => void,
    asset: any

}
export function ModalBurnToken(props: Prop) {
    const { open, handleClose, asset } = props;
    const [form] = Form.useForm();
    const { connected, wallet } = useWallet();


    const handleClick = async () => {
        console.log(form.validateFields())
        form
            .validateFields()
            .then((values) => {
                form.resetFields();
                burn(values.quantity)
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    }

    const burn = async (quantity: string) => {
        try {
            const usedAddress = await wallet.getUsedAddresses();
        console.log("useAdress-------", usedAddress)
        const address = usedAddress[0];
        const forgingScript = ForgeScript.withOneSignature(address);

        const tx = new Transaction({ initiator: wallet });

        // burn asset#1
        const asset1: Asset = {
            unit: asset.unit,
            quantity: quantity.toString(),
        };
        console.log("asset---", asset1)
        tx.burnAsset(forgingScript, asset1);

        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
        console.log(txHash)
        if (txHash) {
            window.open(`https://preprod.cardanoscan.io/transaction/${txHash}`, '_blank', 'noopener,noreferrer')
            handleClose();
        }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <Modal
            open={open}
            title={`Burn Token ${asset.assetName}`}
            okText="Burn"
            cancelText="Cancel"
            onCancel={handleClose}
            onOk={handleClick}
        >
            <Form
                size='large'
                form={form}
                name="form_in_modal"
                initialValues={{ modifier: 'public' }}
                style={{ marginTop: '20px' }}
            >
                <Form.Item
                    name="quantity"
                    label="Quantity"

                    rules={[{ required: true, message: 'Please input the quantity!' }]}
                >
                    <InputNumber min={1} max={asset.quantity} />
                </Form.Item>
            </Form>
        </Modal>
    );
}