import React from 'react';
import ImageCard from './ImageCard';

const ImageAgentSection = () => {
  const styles = {
    imageAgentSection: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '30px',
      padding: '40px 20px',
      marginTop: '40px',
    },
  };

  return (
    <section style={styles.imageAgentSection}>
      <ImageCard
        src="https://picsum.photos/300/200"
        title="AI-Generated Art"
        text="Explore stunning visuals created by our advanced image generation agent."
      />
      <ImageCard
        src="https://picsum.photos/seed/creative/300/200"
        title="Smart Curation"
        text="Personalized image recommendations powered by intelligent algorithms."
      />
      <ImageCard
        src="https://picsum.photos/seed/nextgen/300/200"
        title="Enhanced Experience"
        text="Seamless interaction with elegant design and fluid animations."
      />
    </section>
  );
};

export default ImageAgentSection;
