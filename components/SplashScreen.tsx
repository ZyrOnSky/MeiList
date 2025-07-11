import React from 'react';

const SplashScreen: React.FC = () => (
  <div
    style={{
      width: '100vw',
      height: '100vh',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
    }}
  >
    <img
      src="/assets/images/splash.png"
      alt="Splash MeiList"
      style={{
        maxWidth: '80vw',
        maxHeight: '80vh',
        objectFit: 'contain',
        borderRadius: 24,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}
    />
  </div>
);

export default SplashScreen; 