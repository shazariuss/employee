import React from 'react';
import { Button, Layout } from 'antd';
import logo from '/logo.svg';
import { useNavigate } from 'react-router-dom';

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
        padding: '0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        height: '100%'
      }}>
        <div style={{ flex: 1 }} />
        
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center' 
        }}>
          <img src={logo} alt="Logo" />
         
        </div>
        
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'flex-end' 
        }}>
          <Button type="primary" onClick={() => navigate(`/${link}`)}>
            {text}
          </Button>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;