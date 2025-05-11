
import React, { useRef, useEffect } from 'react';
import Particle from './Particle';
import ShootingStar from './ShootingStar';
import { ANIMATION_CONSTANTS } from './AnimationUtils';

interface ParticleEffectProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
  colorIntensity?: number;
  particleSize?: number;
  moveSpeed?: number;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({
  className = '',
  quantity = 30,
  staticity = 50,
  ease = 50,
  refresh = false,
  colorIntensity = 1,
  particleSize = 1,
  moveSpeed = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const particles = useRef<Array<Particle>>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseIsMoving = useRef<boolean>(false);
  const animationFrame = useRef<number | null>(null);
  const shootingStar = useRef<ShootingStar | null>(null);
  const nextShootingStarTime = useRef<number>(0);

  // Handle mouse movement to create interactive particles
  const onMouseMove = (e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    }
    mouseIsMoving.current = true;
    
    setTimeout(() => {
      mouseIsMoving.current = false;
    }, 100);
  };

  // Resize canvas to match container size
  const resize = () => {
    if (canvasContainerRef.current && canvasRef.current) {
      canvasRef.current.width = canvasContainerRef.current.clientWidth;
      canvasRef.current.height = canvasContainerRef.current.clientHeight;
    }
  };

  // Main animation loop
  const drawParticles = (timestamp: number) => {
    if (context.current) {
      // Clear canvas for new frame
      context.current.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      
      // Update and draw regular particles
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        p.update();
        p.draw();
      }
      
      // Handle shooting star timing
      if (timestamp >= nextShootingStarTime.current) {
        if (!shootingStar.current?.isActive()) {
          if (!shootingStar.current) {
            shootingStar.current = new ShootingStar(context.current, canvasRef.current!);
          }
          shootingStar.current.reset();
          
          // Set the next shooting star time (5-10 seconds from now)
          nextShootingStarTime.current = timestamp + 
            ANIMATION_CONSTANTS.SHOOTING_STAR.MIN_INTERVAL + 
            Math.random() * (ANIMATION_CONSTANTS.SHOOTING_STAR.MAX_INTERVAL - ANIMATION_CONSTANTS.SHOOTING_STAR.MIN_INTERVAL);
        }
      }
      
      // Update and draw shooting star
      if (shootingStar.current) {
        shootingStar.current.update();
        shootingStar.current.draw();
      }
    }
    animationFrame.current = requestAnimationFrame(drawParticles);
  };
  
  // Initialize particles
  const initParticles = () => {
    if (!canvasRef.current || !context.current) return;
    particles.current = [];
    const { width, height } = canvasRef.current;
    
    for (let i = 0; i < quantity; i++) {
      const p = new Particle(
        Math.random() * width,
        Math.random() * height,
        context.current,
        mouse,
        canvasRef.current,
        staticity,
        ease,
        colorIntensity,
        particleSize,
        moveSpeed,
      );
      particles.current.push(p);
    }
  };

  // Setup effect
  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext('2d');
    }
    
    resize();
    initParticles();
    
    // Initialize first shooting star to appear after 2-5 seconds
    nextShootingStarTime.current = performance.now() + 
      ANIMATION_CONSTANTS.SHOOTING_STAR.INITIAL_DELAY.MIN + 
      Math.random() * (ANIMATION_CONSTANTS.SHOOTING_STAR.INITIAL_DELAY.MAX - ANIMATION_CONSTANTS.SHOOTING_STAR.INITIAL_DELAY.MIN);
    
    // Start animation with timestamp
    animationFrame.current = requestAnimationFrame(drawParticles);
    
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  // Refresh particles when props change
  useEffect(() => {
    if (refresh) {
      initParticles();
    }
  }, [refresh, quantity, staticity, ease, colorIntensity, particleSize, moveSpeed]);

  return (
    <div ref={canvasContainerRef} className={`absolute inset-0 w-full h-full ${className}`}>
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
};

export default ParticleEffect;