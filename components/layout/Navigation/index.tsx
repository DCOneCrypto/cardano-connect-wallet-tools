
import { Layout, Menu, Avatar } from 'antd';
import { listMenu } from "@/models";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';
const { Sider } = Layout;


export function NavigationLayout() {
    const router = useRouter();
    const [selectMenu, setSelectMenu] = useState<string>('1')
    
    useEffect(() => {
        const pathname = router.pathname
        const index: number = listMenu.findIndex(x => x.link === pathname)
        if (index != -1) {
            setSelectMenu((index + 1).toString())
        }else if(pathname === "/mint"){
            setSelectMenu("2")
        }
    }, [router])

    return (
        <Sider
            style={{minHeight: '100vh'}}
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
                console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
            }}
        >
            <div className="logo">
            <Avatar src={<img src="/img/dcone_logo.jpg" alt="avatar" />} />
             <span style={{marginLeft: '10px'}}>DCOne Crypto</span>
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[selectMenu]}
                items={listMenu.map(
                    (item, index) => ({
                        key: String(index + 1),
                        icon: React.createElement(item.icon),
                        label: <Link href={item.link}>{item.name}</Link>,
                    }),
                )}
            />
        </Sider>
    );
}