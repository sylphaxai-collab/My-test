import React from 'react';

function App() {
  const styles = {
    app: {
      backgroundColor: '#fffaf9', // creamy white
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
    },
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
    imageAgentSection: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '30px',
      padding: '40px 20px',
      marginTop: '40px',
      width: '100%',
    },
    imageCard: {
      backgroundColor: '#ffffff', // pure white card
      borderRadius: '16px',
      boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      width: '300px',
      textAlign: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    imageCardHover: {
      transform: 'scale(1.03)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
    },
    imagePlaceholder: {
      height: '200px',
      width: '100%',
      objectFit: 'cover',
    },
    cardTitle: {
      fontSize: '1.3rem',
      margin: '16px 0 8px',
      color: '#e84a5f',
    },
    cardText: {
      fontSize: '1rem',
      color: '#666',
      padding: '0 16px 16px',
      lineHeight: '1.5',
    },
  };

  return (
    <div className="App" style={styles.app}>
      {/* Header Section */}
      <header className="App-header" style={styles.header}>
        <h1 style={styles.heading}>SylphaX Ai Labs</h1>
        <p style={styles.paragraph}>
          Pioneering innovation in artificial intelligence with cutting-edge research and intelligent systems.
        </p>
      </header>

      {/* Image Agent Section */}
      <section style={styles.imageAgentSection}>
        <div style={styles.imageCard} onMouseEnter={(e) => Object.assign(e.target.style, styles.imageCardHover)} onMouseLeave={(e) => Object.assign(e.target.style, styles.imageCard)}>
          <img
            src="https://picsum.photos/300/200"
            alt="Generative Vision"
            style={styles.imagePlaceholder}
          />
          <h3 style={styles.cardTitle}>Generative Vision</h3>
          <p style={styles.cardText}>
            Create high-fidelity visual content using advanced generative models trained on diverse multimodal datasets.
          </p>
        </div>

        <div style={styles.imageCard} onMouseEnter={(e) => Object.assign(e.target.style, styles.imageCardHover)} onMouseLeave={(e) => Object.assign(e.target.style, styles.imageCard)}>
          <img
            src="https://picsum.photos/seed/creative/300/200"
            alt="Intelligent Agents"
            style={styles.imagePlaceholder}
          />
          <h3 style={styles.cardTitle}>Intelligent Agents</h3>
          <p style={styles.cardText}>
            Autonomous systems that learn, reason, and act in dynamic environments with real-time decision-making capabilities.
          </p>
        </div>

        <div style={styles.imageCard} onMouseEnter={(e) => Object.assign(e.target.style, styles.imageCardHover)} onMouseLeave={(e) => Object.assign(e.target.style, styles.imageCard)}>
          <img
            src="https://picsum.photos/seed/nextgen/300/200"
            alt="Future Interfaces"
            style={styles.imagePlaceholder}
          />
          <h3 style={styles.cardTitle}>Future Interfaces</h3>
          <p style={styles.cardText}>
            Next-generation human-AI interaction through intuitive, adaptive, and context-aware interface technologies.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
