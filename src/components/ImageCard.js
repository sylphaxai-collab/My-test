import React, { useState } from 'react';

const ImageCard = ({ src, title, text }) => {
  const [isHovered, setIsHovered] = useState(false);

  const styles = {
    imageCard: {
      backgroundColor: '#ffffff',
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
    <div
      style={isHovered ? { ...styles.imageCard, ...styles.imageCardHover } : styles.imageCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={src} alt={title} style={styles.imagePlaceholder} />
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardText}>{text}</p>
    </div>
  );
};

export default ImageCard;
