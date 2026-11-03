import React from 'react';

const Header = () => {
  const styles = {
    header: {
      backgroundColor: '#f8d7da', // soft pink
      padding: '60px 40px',
      borderRadius: '16px',
      textAlign: 'center',
      boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
      marginBottom: '40px',
      marginTop: '20px',
      maxWidth: '900px',
      margin: '20px auto 40px',
    },
    heading: {
      color: '#e84a5f', // deeper soft pink for text
      margin: '0 0 16px 0',
      fontSize: '2.8rem',
      fontWeight: 'bold',
      textShadow: '1px 1px 2px rgba(255,255,255,0.5)',
    },
    paragraph: {
      color: '#555',
      fontSize: '1.2rem',
      lineHeight: '1.6',
      maxWidth: '700px',
      margin: '0 auto',
    },
  };

  return (
    <header className="App-header" style={styles.header}>
      <h1 style={styles.heading}>Welcome to My React App</h1>
      <p style={styles.paragraph}>
        A beautifully designed interface with modern styling, soft tones, and a clean layout.
      </p>
    </header>
  );
};

export default Header;
