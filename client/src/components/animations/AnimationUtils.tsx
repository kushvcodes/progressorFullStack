
// Animation utility functions and types

// Animation timing helper functions
export const easeInOutQuad = (t: number): number => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };
  
  // Common animation constants
  export const ANIMATION_CONSTANTS = {
    SHOOTING_STAR: {
      MIN_INTERVAL: 5000, // 5 seconds
      MAX_INTERVAL: 10000, // 10 seconds
      INITIAL_DELAY: {
        MIN: 2000, // 2 seconds
        MAX: 5000, // 5 seconds
      }
    },
    PARTICLE: {
      RETURN_FACTOR: 0.0005, // Factor for returning to initial position
      FRICTION: 0.95, // Friction coefficient for particle movement
    }
  };