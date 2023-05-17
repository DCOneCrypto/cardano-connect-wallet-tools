//tsrpfc
import { LayoutProps } from "@/models";
import React from 'react';
import { Layout, theme, MenuProps } from 'antd';
import { HeaderLayout } from "./Header";
import { NavigationLayout } from "./Navigation";
const { Content, Footer } = Layout;

export function MainLayout({ children }: LayoutProps) {
  const { token: { colorBgContainer } } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <NavigationLayout/>
      <Layout>
        <HeaderLayout/>
        <Content style={{ margin: '90px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>{children}</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>UpdateGroupTools ©2023 Created by MinhMinh</Footer>
      </Layout>
    </Layout>
  );
}
