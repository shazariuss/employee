import React from 'react';
import { Button, Flex, Layout } from 'antd';
import logo from '/logo.svg';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header: AntHeader } = Layout;

const Header = ({link,text}) => {
    const { user } = useAuth()
    const navigate = useNavigate()
    console.log(user);
    
  return (
    <AntHeader 
      style={{ 
        position: 'fixed',
        top: 0,
        zIndex: 4,
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
          
          <h3>{user.username}</h3>
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