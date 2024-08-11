import React from 'react';

interface HeaderComponentProps {
  title: string;
  description: string;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ title, description }) => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <h1 style={{ fontSize: '36px', margin: '0 0 10px 0' }}>{title}</h1>
      <p style={{ fontSize: '18px', color: 'rgba(0, 0, 0, 0.5)' }}>{description}</p>
    </div>
  );
};

export default HeaderComponent;