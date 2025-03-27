
// ShootingStar.tsx - Extracted from ParticleEffect.tsx
class ShootingStar {
    private x: number;
    private y: number;
    private targetX: number;
    private targetY: number;
    private length: number;
    private speed: number;
    private thickness: number;
    private active: boolean;
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private progress: number;
    private color: string;
    private trailLength: number;
    private opacity: number;
    private controlPoint1X: number;
    private controlPoint1Y: number;
    private controlPoint2X: number;
    private controlPoint2Y: number;
  
    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
      this.ctx = ctx;
      this.canvas = canvas;
      this.active = false;
      this.progress = 0;
      this.reset();
    }
  
    reset() {
      // Start position - randomly on top or sides
      const startEdge = Math.floor(Math.random() * 3); // 0: top, 1: left, 2: right
      
      if (startEdge === 0) { // top
        this.x = Math.random() * this.canvas.width;
        this.y = -50;
      } else if (startEdge === 1) { // left
        this.x = -50;
        this.y = Math.random() * this.canvas.height * 0.7; // Upper 70% of screen
      } else { // right
        this.x = this.canvas.width + 50;
        this.y = Math.random() * this.canvas.height * 0.7; // Upper 70% of screen
      }
      
      // Target position - somewhere on the opposite side
      if (startEdge === 0) { // from top to bottom-left or bottom-right
        this.targetX = this.x + (Math.random() - 0.5) * this.canvas.width;
        this.targetY = this.canvas.height + 50;
      } else if (startEdge === 1) { // from left to bottom-right
        this.targetX = this.canvas.width + 50;
        this.targetY = this.canvas.height * (0.5 + Math.random() * 0.5);
      } else { // from right to bottom-left
        this.targetX = -50;
        this.targetY = this.canvas.height * (0.5 + Math.random() * 0.5);
      }
      
      // Generate curved path control points
      // First control point - between start and end, but offset to create curve
      const midX = (this.x + this.targetX) / 2;
      const midY = (this.y + this.targetY) / 2;
      
      // Create a curved path by placing control points away from the direct line
      const perpX = -(this.targetY - this.y);
      const perpY = this.targetX - this.x;
      const perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
      
      // Use normalized perpendicular vector to offset control points
      const curveMagnitude = Math.min(this.canvas.width, this.canvas.height) * (0.1 + Math.random() * 0.2);
      
      this.controlPoint1X = midX + (perpX / perpLength) * curveMagnitude;
      this.controlPoint1Y = midY + (perpY / perpLength) * curveMagnitude;
      
      // Second control point - slight variation from first for more natural curve
      this.controlPoint2X = midX + (perpX / perpLength) * curveMagnitude * (0.7 + Math.random() * 0.6);
      this.controlPoint2Y = midY + (perpY / perpLength) * curveMagnitude * (0.7 + Math.random() * 0.6);
      
      // Characteristics
      this.length = Math.random() * 150 + 80; // Longer trail
      this.speed = Math.random() * 1.2 + 0.7; // Slower speed for better visuals
      this.thickness = Math.random() * 2 + 1.5; // Slightly thicker line
      this.trailLength = Math.random() * 0.6 + 0.3; // Longer trail as a percentage of total path
      this.opacity = Math.random() * 0.5 + 0.5; // Opacity
      
      // Color - white with a touch of blue
      const hue = Math.floor(Math.random() * 40) + 220; // 220-260 range (blues)
      const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
      this.color = `hsla(${hue}, ${saturation}%, 90%, ${this.opacity})`;
      
      this.progress = 0;
      this.active = true;
    }
  
    update() {
      if (!this.active) return;
      
      // Use easeInOutQuad for smooth animation
      this.progress += 0.004 * this.speed; // Reduced for slower motion
      
      if (this.progress >= 1) {
        this.active = false;
      }
    }
  
    // Easing function for smooth motion
    easeInOutQuad(t: number): number {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }
  
    // Get point on cubic bezier curve
    getBezierPoint(t: number): {x: number, y: number} {
      // Cubic Bezier formula
      const mt = 1 - t;
      const mt2 = mt * mt;
      const mt3 = mt2 * mt;
      const t2 = t * t;
      const t3 = t2 * t;
      
      const x = mt3 * this.x + 
                3 * mt2 * t * this.controlPoint1X + 
                3 * mt * t2 * this.controlPoint2X + 
                t3 * this.targetX;
                
      const y = mt3 * this.y + 
                3 * mt2 * t * this.controlPoint1Y + 
                3 * mt * t2 * this.controlPoint2Y + 
                t3 * this.targetY;
                
      return {x, y};
    }
  
    draw() {
      if (!this.active || !this.ctx) return;
      
      // Apply easing to the progress for smooth motion
      const easedProgress = this.easeInOutQuad(this.progress);
      
      // Get current position on the bezier curve
      const currentPoint = this.getBezierPoint(easedProgress);
      
      // For trail, we need multiple points along the curve slightly behind the current position
      const trailPoints = [];
      const numTrailPoints = 20; // Number of points to create nice trail effect
      
      for (let i = 0; i < numTrailPoints; i++) {
        // Calculate trail positions with decreasing opacity
        const trailProgress = Math.max(0, easedProgress - (this.trailLength * (i / numTrailPoints)));
        if (trailProgress > 0) {
          const point = this.getBezierPoint(trailProgress);
          // Opacity decreases as we go further back in the trail
          const pointOpacity = this.opacity * (1 - (i / numTrailPoints));
          trailPoints.push({...point, opacity: pointOpacity});
        }
      }
      
      // Draw the trail as a gradient path
      if (trailPoints.length > 1) {
        // Create gradient along the path
        this.ctx.beginPath();
        this.ctx.moveTo(trailPoints[trailPoints.length - 1].x, trailPoints[trailPoints.length - 1].y);
        
        // Draw lines between trail points
        for (let i = trailPoints.length - 2; i >= 0; i--) {
          this.ctx.lineTo(trailPoints[i].x, trailPoints[i].y);
        }
        
        // Connect to current position
        this.ctx.lineTo(currentPoint.x, currentPoint.y);
        
        // Set line style with varying thickness
        this.ctx.lineWidth = this.thickness;
        
        // Create gradient for trail
        const gradient = this.ctx.createLinearGradient(
          trailPoints[trailPoints.length - 1].x, trailPoints[trailPoints.length - 1].y,
          currentPoint.x, currentPoint.y
        );
        
        // Gradient transitions from transparent to full color
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, this.color);
        
        this.ctx.strokeStyle = gradient;
        this.ctx.stroke();
      }
      
      // Draw the bright head of the shooting star
      this.ctx.beginPath();
      this.ctx.arc(currentPoint.x, currentPoint.y, this.thickness * 2, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      this.ctx.fill();
      
      // Draw glow around the head
      const gradient = this.ctx.createRadialGradient(
        currentPoint.x, currentPoint.y, this.thickness, 
        currentPoint.x, currentPoint.y, this.thickness * 8
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      gradient.addColorStop(0.5, 'rgba(200, 220, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      this.ctx.beginPath();
      this.ctx.arc(currentPoint.x, currentPoint.y, this.thickness * 8, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    }
  
    isActive(): boolean {
      return this.active;
    }
  }
  
  export default ShootingStar;