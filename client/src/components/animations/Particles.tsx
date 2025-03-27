
import React from 'react';
import ParticleEffect from './ParticleEffect';

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
  colorIntensity?: number;
  particleSize?: number;
  moveSpeed?: number;
}

const Particles: React.FC<ParticlesProps> = (props) => {
  return <ParticleEffect {...props} />;
};

export default Particles;