import React, { useState, useEffect } from 'react';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize to update mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    app: {
      backgroundColor: '#fffaf9', // creamy white
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      backgroundColor: '#f8d7da', // soft pink
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexWrap: 'wrap',
    },
    logo: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#e84a5f',
      margin: 0,
    },
    searchContainer: {
      flex: '1',
      maxWidth: '400px',
      margin: '0 20px',
    },
    searchInput: {
      width: '100%',
      padding: '10px 15px',
      borderRadius: '25px',
      border: '1px solid #ddd',
      fontSize: '1rem',
      outline: 'none',
    },
    profileSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    profileAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#e84a5f',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1rem',
    },
    mainContent: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      minHeight: 'calc(100vh - 80px)',
    },
    sidebar: {
      width: '250px',
      backgroundColor: '#ffffff',
      boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
      padding: '20px',
      position: 'fixed',
      height: 'calc(100vh - 80px)',
      top: '80px',
      left: 0,
      overflowY: 'auto',
      zIndex: 99,
    },
    navList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    navItem: {
      padding: '12px 16px',
      borderRadius: '8px',
      color: '#555',
      textDecoration: 'none',
      display: 'block',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      marginBottom: '8px',
    },
    navItemActive: {
      backgroundColor: '#e84a5f',
      color: '#fff',
    },
    content: {
      flex: 1,
      marginLeft: '250px',
      padding: '40px 20px',
      backgroundColor: '#fffaf9',
    },
    // Corrected media query syntax with hyphenated 'max-width'
    '@media (max-width: 768px)': {
      header: {
        flexDirection: 'column',
        padding: '15px',
        gap: '10px',
      },
      searchContainer: {
        maxWidth: '100%',
        margin: '10px 0',
      },
      profileSection: {
        order: 3,
      },
      sidebar: {
        width: '100%',
        position: 'relative',
        height: 'auto',
        top: 'initial',
        left: 'initial',
        padding: '10px',
        marginBottom: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
        zIndex: 1, // Ensure proper stacking on mobile
      },
      mainContent: {
        flexDirection: 'column',
      },
      content: {
        marginLeft: 0,
        padding: '20px 10px',
        zIndex: 0, // Lower than sidebar to avoid overlap
      },
    },
  };

  // Use corrected media query key
  const mediaQueryStyles = styles['@media (max-width: 768px)'];

  return (
    <div className="App" style={styles.app}>
      {/* Top Header */}
      <header className="App-header" style={{ ...styles.header, ...(isMobile ? mediaQueryStyles.header : {}) }}>
        <h1 style={styles.logo}>SaaS Dashboard</h1>
        <div style={{ ...styles.searchContainer, ...(isMobile ? mediaQueryStyles.searchContainer : {}) }}>
          <input type="text" placeholder="Search..." style={styles.searchInput} />
        </div>
        <div style={{ ...styles.profileSection, ...(isMobile ? mediaQueryStyles.profileSection : {}) }}>
          <div style={styles.profileAvatar}>U</div>
        </div>
      </header>

      {/* Main Layout */}
      <div
        style={{
          ...styles.mainContent,
          ...(isMobile ? mediaQueryStyles.mainContent : {}),
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            ...styles.sidebar,
            ...(isMobile ? mediaQueryStyles.sidebar : {}),
          }}
        >
          <nav>
            <ul style={styles.navList}>
              <li>
                <a href="#overview" style={{ ...styles.navItem, ...styles.navItemActive }}>Overview</a>
              </li>
              <li>
                <a href="#projects" style={styles.navItem}>Projects</a>
              </li>
              <li>
                <a href="#tasks" style={styles.navItem}>Tasks</a>
              </li>
              <li>
                <a href="#team" style={styles.navItem}>Team</a>
              </li>
              <li>
                <a href="#analytics" style={styles.navItem}>Analytics</a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main
          style={{
            ...styles.content,
            ...(isMobile ? mediaQueryStyles.content : {}),
          }}
        >
          <h2 style={{ color: '#e84a5f', marginBottom: '20px' }}>Dashboard Overview</h2>
          <p>Welcome to your project management dashboard. Navigate using the sidebar.</p>
        </main>
      </div>
    </div>
  );
}

export default App;
