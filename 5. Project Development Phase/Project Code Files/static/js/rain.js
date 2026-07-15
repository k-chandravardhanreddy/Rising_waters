// Premium Interactive Canvas Rain Animation

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('rainCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Set dimensions
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  // Settings
  const maxDrops = 140;
  const drops = [];
  const splashes = [];
  const maxSplashes = 80;
  
  // Mouse tracking
  const mouse = { x: -1000, y: -1000, radius: 100 };
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  
  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  // Raindrop Class
  class Drop {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // Start at random height initially
    }
    
    reset() {
      this.x = Math.random() * width;
      this.y = -20;
      this.length = Math.random() * 20 + 10;
      this.speed = Math.random() * 8 + 12;
      this.weight = Math.random() * 1.5 + 0.8;
      this.opacity = Math.random() * 0.25 + 0.15;
    }
    
    draw() {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(56, 189, 248, ${this.opacity})`;
      ctx.lineWidth = this.weight;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x, this.y + this.length);
      ctx.stroke();
    }
    
    update() {
      // Proximity deflection
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < mouse.radius) {
        // Push drop away from cursor slightly
        const force = (mouse.radius - dist) / mouse.radius;
        this.x += (dx / dist) * force * 5;
      }
      
      this.y += this.speed;
      
      // Hit bottom check
      if (this.y + this.length >= height) {
        createSplash(this.x, height - 3);
        this.reset();
      }
    }
  }
  
  // Splash particle class
  class Splash {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = Math.random() * 4 - 2;
      this.vy = Math.random() * -3 - 2;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = 0.8;
      this.gravity = 0.15;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
      ctx.fill();
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.alpha -= 0.04;
    }
  }
  
  // Instantiate drops
  for (let i = 0; i < maxDrops; i++) {
    drops.push(new Drop());
  }
  
  function createSplash(x, y) {
    if (splashes.length >= maxSplashes) {
      splashes.shift();
    }
    // Create 2-4 splash particles
    const count = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < count; i++) {
      splashes.push(new Splash(x, y));
    }
  }
  
  // Main Loop
  function animate() {
    // Clear with slight transparency for trail effect
    ctx.fillStyle = 'rgba(7, 11, 19, 0.25)';
    ctx.fillRect(0, 0, width, height);
    
    // Update and draw drops
    drops.forEach(drop => {
      drop.update();
      drop.draw();
    });
    
    // Update and draw splashes
    for (let i = splashes.length - 1; i >= 0; i--) {
      const splash = splashes[i];
      splash.update();
      if (splash.alpha <= 0) {
        splashes.splice(i, 1);
      } else {
        splash.draw();
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
});
