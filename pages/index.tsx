import Link from 'next/link';
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import client from './api/apollo';
import type { MenuProps } from 'antd';
import { Layout, Menu, Button, ConfigProvider } from 'antd';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';

import HeaderComponent from '../components/header';

import FeedPage from './feeds';

// Importing assets
import logo from '../public/logo.png';

const { Content, Sider } = Layout;

const menuMeta: Array<any> = [
  [NotificationOutlined, 'Feed'],
  [LaptopOutlined, 'New Blog'],
  [UserOutlined, 'Account']
]

const menuItem: MenuProps['items'] = menuMeta.map(
  ([icon, title], _) => {
    return {
      key: title,
      icon: React.createElement(icon),
      label: title,
    };
  },
);


function ContentComponent(props: any) {
  if (props.selectedKey === "Feed") {
    return <FeedPage />
  } else if (props.selectedKey === "New Blog") {
    return <div>New Blog Page</div>
  } else {
    return <div>Account Page</div>
  }
}

// @ts-ignore, to ignore implicit any type binding
export default function HomePage() {
    const [selectedKey, setSelectedKey] = useState("Feed");

    // @ts-ignore
    function onMenuChange({ key }) {
      console.log(key);
      setSelectedKey(key);
    }

    return (
      <ConfigProvider
        theme={{
          components: {
            Menu: { // menu theme
              colorItemBgSelected: '#ddd'
            }
          },
          token: {  // global theme
            colorPrimary: '#000'
          }
        }}
      >
        <Head>
          <link rel="favicon" href={logo.src} />
        </Head>
        {/* Start the layout */}
        <Layout style={{ height: '100vh' }}>
          <HeaderComponent/>
          <Layout>
            <Sider width={200} style={{ background: '#dddddd' }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['Feed']}
                defaultOpenKeys={['Feed']}
                style={{ height: '100%', borderRight: 0, paddingTop: 10 }}
                onClick={onMenuChange}
                items={menuItem}
              />
            </Sider>
            <Layout style={{ padding: '0 24px 24px', marginTop: 10 }}>
              <Content
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 280,
                  height: '80%',
                  background: '#fff',
                  color: '#000',
                  overflow: 'auto'
                }}
              >
                <ContentComponent selectedKey={selectedKey} style={{ color: "#000" }}/>
              </Content>
            </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}