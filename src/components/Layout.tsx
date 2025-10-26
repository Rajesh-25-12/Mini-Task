import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as AntLayout, Button, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices';

const { Header, Content } = AntLayout;

const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end', // Push content to the right
          background: 'rgb(4 7 43)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '0 24px',
          color: '#fff',
        }}
      >
        {isAuthenticated && (
          <Space align='center' size='middle'>
            <span style={{ fontWeight: 500 }}>Elon Musk</span>
            <Button
              type='primary'
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            />
          </Space>
        )}
      </Header>

      <Content style={{ padding: '24px', background: '#f5f5f5' }}>
        <Outlet />
      </Content>
    </AntLayout>
  );
};

export default Layout;
