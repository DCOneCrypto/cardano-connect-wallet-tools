//tsrpfc
import { LayoutProps } from "@/models";
import { Layout, theme, MenuProps, Menu } from 'antd';
import { HeaderLayout } from "./Header";
import { NavigationLayout } from "./Navigation";
const { Content, Footer } = Layout;
import { listMenu } from "@/models";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';
const { Sider, Header } = Layout;

export function MainLayout({ children }: LayoutProps) {
  const { token: { colorBgContainer } } = theme.useToken();
  const router = useRouter();
  const [selectMenu, setSelectMenu] = useState<string>('1')

  useEffect(() => {
    const pathname = router.pathname
    console.log(pathname)
    const index: number = listMenu.findIndex(x => x.link === pathname)
    if (index != -1) {
      console.log(index)
      setSelectMenu((index + 1).toString())
    }
  }, [router])


  return (
    <Layout >
      <NavigationLayout />
      <Layout>
        <HeaderLayout />
        <Content style={{ margin: '16px 16px 0' }}>
          <div style={{ padding: 24, minHeight: "80vh", background: colorBgContainer }}>{children}</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>UpdateGroupTools ©2023 Created by MinhMinh</Footer>
      </Layout>
    </Layout>
  );
}
