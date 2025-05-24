import React from 'react';
import './learn.css';

const ExoplanetTypes = () => {
  const exoplanetData = [
    {
      type: 'Hot Jupiter',
      description: 'Gas giants that orbit extremely close to their stars, leading to scorching temperatures.',
      image: '/planet-img/gas-gaint.png', // Replace with actual image URL
    },
    {
      type: 'Super Earth',
      description: 'Rocky planets larger and more massive than Earth, potentially with diverse environments.',
      image: '/planet-img/neputain.png', // Replace with actual image URL
    },
    {
      type: 'Mini Neptune',
      description: 'Smaller, denser versions of Neptune with thick atmospheres and potentially rocky cores.',
      image: '/planet-img/super_earth.png', // Replace with actual image URL
    },
    {
      type: 'Ocean World',
      description: 'Planets covered entirely or mostly by water, potentially harboring exotic forms of life.',
      image: '/planet-img/territrail.png', // Replace with actual image URL
    },
  ];

  return (
    <div className="exoplanet-section">
      <h2>What is Exoplanet Data?</h2>
      <p>Exoplanets are planets outside our solar system. These planets come in various types such as gas giants, super-Earths, and ocean worlds, each with unique characteristics and environments.</p>

      <div className="exoplanet-cards">
        {exoplanetData.map((planet, index) => (
          <div className="card" key={index}>
            <img src={planet.image} alt={planet.type} />
            <div className="hover-info">{planet.description}</div> {/* Info on hover */}
            <div className="card-content">
              <h3>{planet.type}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExoplanetTypes;
