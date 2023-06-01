import {
  Asset,
  Bundle,
  NextPageWithLayout,
  Nft,
  PositionForm,
  redirect_scan,
} from "@/models";
import { MainLayout } from "components/layout";
import React from "react";
import { Card, Space } from "antd";
import { useEffect, useState } from "react";
import { useAssets, useWallet } from "@meshsdk/react";
import { ModalTokenList } from "@/components/form";
import { Transaction } from "@meshsdk/core";
import { AlertUpdateGroup } from "@/components/common";
import { Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { Seo } from "@/components/common/seo";
import { useRouter } from "next/router";
import Script from "next/script";

const { Title, Text } = Typography;

const Home: NextPageWithLayout = () => {
  const { connected, wallet } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [errorInputBalance, setErrorInputBalance] = useState<boolean>(false);
  const router = useRouter();
  const initBundle = () => {
    const bundle: Bundle = {
      address: "",
      nfts: [
        {
          type: "ada",
          balance: 0,
          name: "ada",
          unit: "",
          quantity_default: balance,
        },
      ],
    };
    return bundle;
  };
  const assets = useAssets();
  const [positionForm, setPositionForm] = useState<PositionForm>();
  const [inputFields, setInputFields] = useState<Array<Bundle>>([initBundle()]);
  const [array_assets, setAssets] = useState<Array<Asset>>(new Array<Asset>());
  useEffect(() => {
    if (wallet && connected) {
      refresh_assets();
      getWallet();
    } else {
      setBalance(0);
      handReset();
      setAssets(new Array<Asset>());
    }
  }, [assets, wallet, connected]);

  const refresh_assets = () => {
    if (assets) {
      let arr: any[] = [];
      assets.forEach((item: any) => {
        arr.push({
          assetName: item.assetName,
          quantity: item.quantity,
          unit: item.unit,
        });
      });
      setAssets(arr);
    }
  };

  const addFields = () => {
    const newfield: Bundle = {
      address: "",
      nfts: [
        {
          type: "ada",
          balance: 0,
          name: "",
          unit: "",
          quantity_default: balance,
        },
      ],
    };

    setInputFields([...inputFields, newfield]);
  };

  const removeFields = (index: number) => {
    let data = [...inputFields];
    data.splice(index, 1);
    setInputFields(data);
  };
  const removeNftFields = (index: number, key: number) => {
    let data = [...inputFields];
    data[index].nfts.splice(key, 1);
    setInputFields(data);
  };

  const addNft = (index: number) => {
    let data = [...inputFields];
    const nfts: Array<Nft> = data[index].nfts;
    if (nfts.filter((x) => x.type == "ada").length > 0) {
      let asset_unit_exists: Array<string> = [];
      nfts.forEach((item) => {
        if (item.type != "ada") {
          asset_unit_exists.push(item.unit);
        }
      });
      console.log("arraybefore--", array_assets);
      const new_arr_assets = array_assets.filter(
        (x) => !asset_unit_exists.includes(x.unit)
      );
      setAssets(new_arr_assets);
      console.log("add--", new_arr_assets);
      setPositionForm({ parent: index, child: -1 });
      setOpenModal(true);
    } else {
      let obj = data[index];
      obj.nfts.push({
        type: "ada",
        balance: 0,
        name: "ada",
        unit: "",
        quantity_default: balance,
      });
      setInputFields(data);
    }
  };

  const handleFormChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let data = [...inputFields];
    data[index].address = event.target.value;
    setInputFields(data);
  };

  const handleFormChangeNft = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
    key: number
  ) => {
    console.log("vale:--", event.target.value);
    console.log(
      inputFields.filter((x) => x.nfts.filter((y) => y?.error === true))
    );

    let data = [...inputFields];
    try {
      let value = Number(event.target.value);
      if (typeof value != "number") {
      }
      const nft_current: Nft = data[index].nfts[key];
      if (nft_current.type === "nft") {
        let nfts: any[] = [];
        for (let i = 0; i < data.length; i++) {
          nfts = nfts.concat(
            data[i].nfts.filter(
              (x) => x.type == "nft" && x.unit == nft_current.unit
            )
          );
        }
        const total_balance =
          nfts.reduce((n, { balance }) => Number(n) + Number(balance), 0) +
          Number(value) -
          Number(nft_current.balance);
        if (Number(nft_current.quantity_default) < total_balance) {
          data[index].nfts[key].error = true;
          data[index].nfts[key].balance = Number(value);
          setErrorInputBalance(true);
        } else {
          data[index].nfts[key].error = false;
          data[index].nfts[key].balance = Number(value);
          setErrorInputBalance(false);
        }
      } else {
        let nfts: Nft[] = [];
        for (let i = 0; i < data.length; i++) {
          nfts = nfts.concat(data[i].nfts.filter((x) => x.type == "ada"));
        }
        const total_balance =
          nfts.reduce((n, { balance }) => Number(n) + Number(balance), 0) +
          Number(value) -
          Number(nft_current.balance);
        if (balance < total_balance) {
          data[index].nfts[key].error = true;
          data[index].nfts[key].balance = Number(value);
          setErrorInputBalance(true);
        } else {
          data[index].nfts[key].error = false;
          data[index].nfts[key].balance = Number(value);
          setErrorInputBalance(false);
        }
      }
      setInputFields(data);
    } catch (error) {
      console.log(error);
    }
    console.log("da---", data);
  };
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handCloseModal = (asset: Asset) => {
    setOpenModal(false);
    if (positionForm && positionForm.child != -1 && asset?.assetName) {
      let data = [...inputFields];
      data[positionForm.parent].nfts[positionForm.child].name = asset.assetName;
      data[positionForm.parent].nfts[positionForm.child].type = "nft";
      data[positionForm.parent].nfts[positionForm.child].unit = asset.unit;
      data[positionForm.parent].nfts[positionForm.child].quantity_default =
        asset.quantity;
      setInputFields(data);
    } else if (asset?.assetName && positionForm) {
      let data = [...inputFields];
      let obj = data[positionForm.parent];
      obj.nfts.push({
        type: "nft",
        balance: 0,
        name: asset.assetName,
        unit: asset.unit,
        quantity_default: asset.quantity,
      });
      setInputFields(data);
    }
    refresh_assets();
  };
  const handOpenModal = (parent: number, child: number) => {
    setPositionForm({
      parent: parent,
      child: child,
    });
    let data = [...array_assets];
    const nfts: Array<Nft> = inputFields[parent].nfts;
    let asset_unit_exists: Array<string> = [];
    nfts.forEach((item) => {
      if (item.type != "ada") {
        asset_unit_exists.push(item.unit);
      }
    });
    const new_arr_assets = data.filter(
      (x) => !asset_unit_exists.includes(x.unit)
    );
    setAssets(new_arr_assets);
    setOpenModal(true);
  };

  const handReset = () => {
    setInputFields([initBundle()]);
    refresh_assets();
  };
  // const lovelace = useLovelace();
  const getWallet = async () => {
    const ada = await wallet.getBalance();
    const result = ada.find((obj: any) => {
      return obj.unit === "lovelace";
    });
    if (result) {
      setBalance(result.quantity / 1000000);
    }
  };

  const handSubmit = async () => {
    console.log(inputFields);
    try {
      let is_valid = false;
      const tx = new Transaction({ initiator: wallet });
      for (const recipient of inputFields) {
        const adas: Array<Nft> = recipient.nfts.filter(
          (x) => x.type === "ada" && Number(x.balance) > 0
        );
        if (adas && adas.length > 0) {
          tx.sendLovelace(
            { address: recipient.address },
            `${adas[0].balance.toString()}000000`
          );
        }
        const nfts: Array<Nft> = recipient.nfts.filter(
          (x) => x.type === "nft" && Number(x.balance) > 0
        );
        if ((adas && adas.length > 0) || (nfts && nfts.length > 0)) {
          is_valid = true;
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
      console.log(tx);
      if (!is_valid) {
        console.log("not found quantity");
        return;
      }
      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      if (txHash) {
        handReset();
        redirect_scan(txHash, inputFields[0].address);
      }
      console.log(txHash);
    } catch (error) {
      console.log("erro--", error);
    }
  };

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-68XXGS68BB"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-68XXGS68BB');
        `}
      </Script>

      <Seo
        data={{
          title: "Send Multiple Tokens",
          description:
            "Users send multiple ADA addresses, tokens and create your own NFT, Mint, Burn with just a few clicks",
          thumbnailUrl: "/img/dcone_logo.jpg",
          url: "https://cardano.dconecrypto.finance/",
        }}
      />

      <Space direction="vertical" size={16} style={{ display: "flex" }}>
        <Title level={2}>Send Multiple Tokens</Title>
        <AlertUpdateGroup show={!connected} />
        {inputFields.map((input, index) => {
          return (
            <Card
              key={index}
              title={`Bundle ${index + 1}`}
              size="small"
              extra={
                inputFields.length > 1 && (
                  <Tooltip title={`Delete bundle ${index + 1}`}>
                    <Button
                      type="text"
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => {
                        removeFields(index);
                      }}
                    />
                  </Tooltip>
                )
              }
            >
              <Space direction="vertical" size={16} style={{ display: "flex" }}>
                <Input
                  name="address"
                  placeholder={`Recipient's address ${index + 1}`}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleFormChange(index, event)
                  }
                  value={input.address}
                  suffix={
                    <Tooltip title={`Address ${index + 1}`}>
                      <InfoCircleOutlined
                        style={{ color: "rgba(0,0,0,.45)" }}
                      />
                    </Tooltip>
                  }
                />
                <Row gutter={[16, 16]}>
                  {input.nfts.map((value, key) => (
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} key={key}>
                      <Card
                        size="small"
                        className="ant-card-box-up"
                        title={`Total: ${
                          value.type == "ada"
                            ? balance.toLocaleString().split(".")[0]
                            : value.quantity_default
                        }`}
                        extra={
                          input.nfts.length > 1 && (
                            <Tooltip title="Delete nft">
                              <Button
                                type="text"
                                danger
                                icon={<CloseOutlined />}
                                onClick={() => removeNftFields(index, key)}
                              />
                            </Tooltip>
                          )
                        }
                      >
                        <Row justify="space-between">
                          <Col span={12}>
                            <Space direction="vertical">
                              <Button
                                type="text"
                                disabled={
                                  array_assets.length > 0 ? false : true
                                }
                                onClick={() => handOpenModal(index, key)}
                              >
                                {value.type == "nft"
                                  ? value.name.substring(0, 7) + "..."
                                  : "ada"}{" "}
                                <ArrowRightOutlined />
                              </Button>
                              {/* <Text>Total: {value.type == 'ada' ? balance.toLocaleString().split(".")[0] : value.quantity_default}</Text> */}
                            </Space>
                          </Col>
                          <Col span={12}>
                            <Space direction="vertical">
                              <Input
                                type="number"
                                name="nft"
                                value={value.balance}
                                onChange={(value) =>
                                  handleFormChangeNft(index, value, key)
                                }
                              />
                              {value?.error && (
                                <Text
                                  type="danger"
                                  style={{ fontSize: "10px" }}
                                >
                                  Insufficient balance {value?.error}
                                </Text>
                              )}
                            </Space>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {array_assets.length > 0 && (
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                      <Button
                        block
                        type="primary"
                        ghost
                        onClick={() => addNft(index)}
                      >
                        Add Token or Nft
                      </Button>
                    </Col>
                  </Row>
                )}
              </Space>
            </Card>
          );
        })}
        <Button block type="primary" ghost onClick={addFields}>
          Add Bundle
        </Button>
      </Space>
      <Space style={{ marginTop: "20px" }}>
        <Button
          type="primary"
          onClick={handSubmit}
          disabled={
            inputFields.filter((x) => x.address === "").length > 0 ||
            errorInputBalance ||
            !connected
          }
        >
          Submit
        </Button>
        <Button onClick={handReset}>Reset</Button>
      </Space>
      <ModalTokenList
        open={openModal}
        handleClose={handCloseModal}
        assets={array_assets}
      />
    </>
  );
};
Home.Layout = MainLayout;
export default Home;
