import React from "react";
import { Alert } from 'antd';

interface AlertUG {
  show: boolean;
}
export function AlertUpdateGroup(prop: AlertUG) {
  const {show} = prop

  return (
    <>
    {
        show && <Alert message="Connect your wallet and start exploring" type="warning" showIcon />
    }
    </>
  )
}
