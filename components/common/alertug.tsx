import React from "react";
import { Alert } from "@mui/material";

interface AlertUG {
  show: boolean;
}
export function AlertUpdateGroup(prop: AlertUG) {
  const {show} = prop

  return (
    <>
    {
        show &&  <Alert severity="warning">Connect wallet for use!</Alert>
    }
    </>
  )
}
