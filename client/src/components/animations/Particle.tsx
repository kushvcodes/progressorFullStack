
import React from 'react';

class Particle {
  private x: number;
  private y: number;
  private ctx: CanvasRenderingContext2D;
  private mouse: React.MutableRefObject<{ x: number; y: number }>;
  private canvas: HTMLCanvasElement;
  private vx: number;
  private vy: number;
  private radius: number;
  private staticity: number;
  private ease: number;
  private friction: number;
  private color: string;
  private colorIntensity: number;
  private moveSpeed: number;
  private initialX: number;
  private initialY: number;
  private time: number;
  private amplitude: number;

  constructor(
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
    mouse: React.MutableRefObject<{ x: number; y: number }>,
    canvas: HTMLCanvasElement,
    staticity: number,
    ease: number,
    colorIntensity: number = 1,
    particleSize: number = 1,
    moveSpeed: number = 1,
  ) {
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.ctx = ctx;
    this.mouse = mouse;
    this.canvas = canvas;
    this.staticity = staticity;
    this.ease = ease;
    this.colorIntensity = colorIntensity;
    this.moveSpeed = moveSpeed;
    this.friction = 0.95;
    this.time = Math.random() * 100;
    this.amplitude = Math.random() * 2 + 1; // Random amplitude for more varied motion
    
    this.radius = (Math.random() * 1.5 + 0.5) * particleSize;
    this.vx = (Math.random() - 0.5) * 0.5 * moveSpeed; // Initial velocity for more immediate motion
    this.vy = (Math.random() - 0.5) * 0.5 * moveSpeed;
    
    // Enhanced colors with better visibility
    const hue = Math.floor(Math.random() * 60) + 210; // 210-270 range (blues to purples)
    const saturation = Math.floor(Math.random() * 40) + 60; // 60-100%
    const lightness = Math.floor(Math.random() * 30) + 70; // 70-100%
    const alpha = (Math.random() * 0.3 + 0.2) * colorIntensity; // 0.2-0.5 * intensity
    this.color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  }

  update() {
    this.time += 0.01;
    
    // Distance from mouse
    const dx = this.mouse.current.x - this.x;
    const dy = this.mouse.current.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 150;
    
    // Mouse repulsion with stronger effect
    if (distance < maxDistance) {
      const angle = Math.atan2(dy, dx);
      const force = (maxDistance - distance) / maxDistance;
      
      const targetX = this.x - Math.cos(angle) * force * this.staticity;
      const targetY = this.y - Math.sin(angle) * force * this.staticity;
      
      this.vx += (targetX - this.x) / this.ease;
      this.vy += (targetY - this.y) / this.ease;
    }
    
    // Enhanced floating movement with varied amplitudes
    const floatX = Math.sin(this.time * 0.3 * this.moveSpeed) * this.amplitude;
    const floatY = Math.cos(this.time * 0.2 * this.moveSpeed) * this.amplitude;
    
    this.vx += floatX * 0.02;
    this.vy += floatY * 0.02;
    
    // Random movement occasionally for more dynamic behavior
    if (Math.random() < 0.02) {
      this.vx += (Math.random() - 0.5) * 0.8 * this.moveSpeed;
      this.vy += (Math.random() - 0.5) * 0.8 * this.moveSpeed;
    }
    
    // Tendency to return to initial position slowly
    const returnFactor = 0.0005;
    this.vx += (this.initialX - this.x) * returnFactor;
    this.vy += (this.initialY - this.y) * returnFactor;
    
    // Apply friction
    this.vx *= this.friction;
    this.vy *= this.friction;
    
    // Apply velocity
    this.x += this.vx;
    this.y += this.vy;
    
    // Boundary checking with bounce effect
    if (this.x < 0) {
      this.x = 0;
      this.vx *= -1.0;
    } else if (this.x > this.canvas.width) {
      this.x = this.canvas.width;
      this.vx *= -1.0;
    }
    
    if (this.y < 0) {
      this.y = 0;
      this.vy *= -1.0;
    } else if (this.y > this.canvas.height) {
      this.y = this.canvas.height;
      this.vy *= -1.0;
    }
  }

  draw() {
    // Add a subtle glow effect
    const glow = this.radius * 3;
    const gradient = this.ctx.createRadialGradient(
      this.x, this.y, this.radius * 0.5,
      this.x, this.y, glow
    );
    
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, glow, 0, Math.PI * 2);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Draw the actual particle
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
}

export default Particle;