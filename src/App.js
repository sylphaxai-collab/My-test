import React from 'react';

function App() {
  const styles = {
    app: {
      backgroundColor: '#fffaf9', // creamy white
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      backgroundColor: '#f8d7da', // soft pink
      padding: '40px',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      marginTop: '20px',
    },
    heading: {
      color: '#e84a5f', // deeper soft pink for text
      margin: '0 0 16px 0',
    },
    paragraph: {
      color: '#555',
      fontSize: '18px',
    },
  };

  return (
    <div className="App" style={styles.app}>
      <header className="App-header" style={styles.header}>
        <h1 style={styles.heading}>Welcome to My React App</h1>
        <p style={styles.paragraph}>
          This is a basic React setup with App.js and index.js.
        </p>
      </header>
    </div>
  );
}

export default App;
