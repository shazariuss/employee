import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { 
  UserAddOutlined, 
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.split('/')[1] || '/';
  const activePath = currentPath === 'edit' ? '/search' : `/${currentPath}`;

  const menuItems = [
    {
      key: '/',
      icon: <UserAddOutlined />,
      label: 'Регистрация',
    },
    {
      key: '/search',
      icon: <TeamOutlined />,
      label: 'Поиск сотрудников',
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        width={256}
        collapsed={collapsed}
        theme="light"
        className="min-h-screen"
      >
        <div className="p-4">
          <Button
            type="text"
            style={{color:'#000'}}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="w-full text-white mb-4"
          />
        </div>
        <Menu
          theme="light"
          selectedKeys={[activePath]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          inlineCollapsed={collapsed}
        />
      </Sider>
      <Layout>
        <Content className="m-6 p-6 min-h-[280px]">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;