import React from 'react';
import { Button, Flex, Layout } from 'antd';
import logo from '/logo.svg';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Header = ({link,text}) => {
    const navigate = useNavigate()
  return (
    <AntHeader 
      style={{ 
        position: 'fixed',
        top: 0,
        zIndex: 1000,
        width: '100%',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display:'flex',
        justifyContent:'end',
        padding:'0 30px'
      }}
    >
        <Flex gap={10} align='center'>
          <Button
            style={{borderRadius:'50%'}}
            type="primary"
            icon={<UserOutlined />}
          />
          
          <h3>Salimov Shoxrux</h3>
          <Button
            style={{borderRadius:'50%'}}
            type="default"
            icon={<LogoutOutlined />}
          />
          
        </Flex>          

    </AntHeader>
  );
};

export default Header;