
import { Layout, Menu } from 'antd';
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
        console.log(pathname)
        const index: number = listMenu.findIndex(x => x.link === pathname)
        if (index != -1) {
            console.log(index)
            setSelectMenu((index + 1).toString())
        }
    }, [router])

    return (
        <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
                console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
            }}
        >
            <div className="logo" />
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