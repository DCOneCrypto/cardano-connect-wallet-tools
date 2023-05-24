//tsrpfc
import { LayoutProps } from "@/models";
import { Layout, theme } from 'antd';
import { HeaderLayout } from "./Header";
import { NavigationLayout } from "./Navigation";
const { Content } = Layout;
import React from 'react';
import { FooterLayout } from "./Footer";
 
// pages/index.js
// import dynamic from 'next/dynamic';
 
// const DynamicComponent = dynamic(() =>
//   import('../layout/main').then((mod) => mod.Hello),
// );
// const DynamicFooter = dynamic(() => import('../layout/Footer').then((mod) => mod.FooterLayout), {
//   ssr: false,
// });

export function MainLayout({ children }: LayoutProps) {
  const { token: { colorBgContainer } } = theme.useToken();


  return (
    <Layout >
      <NavigationLayout />
      <Layout>
        <HeaderLayout />
        <Content style={{ margin: '16px 16px 0' }}>
          <div style={{ padding: 24, minHeight: "80vh", background: colorBgContainer }}>{children}</div>
        </Content>
        <FooterLayout/>
      </Layout>
    </Layout>
  );
}
