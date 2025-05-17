import React, { useEffect, useState } from 'react';
import './TransparentWaterEffect.css';

const InteractiveBubbleEffect = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    
    // Create bubble container if it doesn't exist
    if (!document.querySelector('.bubble-effect-container')) {
      const bubbleContainer = document.createElement('div');
      bubbleContainer.className = 'bubble-effect-container';
      document.body.appendChild(bubbleContainer);
      
      // Add click handler to button
      const buttonElement = document.querySelector('.create-bubble-btn');
      if (buttonElement) {
        buttonElement.addEventListener('click', () => createBubbles(10, true));
      }
      
      // Start creating bubbles
      createBubbles();
      setInterval(createBubbles, 5000); // Add new bubbles every 3 seconds
    }
    
    setInitialized(true);
  }, [initialized]);

  // Function to create explosion effect
  const createExplosion = (x, y, size) => {
    const container = document.querySelector('.bubble-effect-container');
    if (!container) return;
    
    // Create particles
    const particleCount = 8 + Math.floor(size / 5);
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'bubble-particle';
      
      // Size based on original bubble
      const particleSize = (size / 8) + (Math.random() * size / 4);
      particle.style.width = `${particleSize}px`;
      particle.style.height = `${particleSize}px`;
      
      // Position at explosion center
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      // Random direction
      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 80;
      
      container.appendChild(particle);
      
      // Animate explosion
      const startTime = Date.now();
      const duration = 500 + Math.random() * 500;
      
      const animateParticle = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        if (progress >= 1) {
          particle.remove();
          return;
        }
        
        // Move outward
        const currentDistance = distance * progress;
        const posX = x + Math.cos(angle) * currentDistance;
        const posY = y + Math.sin(angle) * currentDistance;
        
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = (1 - progress).toString();
        particle.style.transform = `scale(${1 - progress * 0.5})`;
        
        requestAnimationFrame(animateParticle);
      };
      
      requestAnimationFrame(animateParticle);
    }
    
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'bubble-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    container.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
    // Play pop sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800 + Math.random() * 500, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  // Function to create interactive bubbles
  const createBubbles = (count = 4, fromCenter = false) => {
    const container = document.querySelector('.bubble-effect-container');
    if (!container) return;
    
    // Clear bubbles if there are too many
    const existingBubbles = container.querySelectorAll('.soap-bubble:not(.exploding)');
    if (existingBubbles.length > 30) {
      const oldestBubbles = Array.from(existingBubbles).slice(0, 5);
      oldestBubbles.forEach(bubble => bubble.remove());
    }
    
    // Create new bubbles
    const bubbleCount = count || 3 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement('div');
      
      // Rainbow effect on some bubbles
      const hasRainbow = Math.random() > 6;
      bubble.className = `soap-bubble ${hasRainbow ? 'rainbow' : ''}`;
      
      // Random size
      const size = 20 + Math.random() * 60;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      
      // Position based on whether from center or from bottom
      if (fromCenter) {
        // Start position in middle of screen
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const spreadRadius = Math.min(window.innerWidth, window.innerHeight) * 0.3;
        
        bubble.style.left = `${centerX - spreadRadius/2 + Math.random() * spreadRadius}px`;
        bubble.style.top = `${centerY - spreadRadius/2 + Math.random() * spreadRadius}px`;
      } else {
        // Start position from bottom with randomness
        bubble.style.left = `${Math.random() * window.innerWidth}px`;
        bubble.style.top = `${window.innerHeight + Math.random() * 100}px`;
      }
      
      // Animation variation
      const duration = 20 + Math.random() * 12; // 8-20 seconds
      bubble.style.animationDuration = `${duration}s`;
      
      // Random delay
      const delay = fromCenter ? 10 : Math.random() * 5;
      bubble.style.animationDelay = `${delay}s`;
      
      // Random horizontal drift
      const driftAmount = -100 + Math.random() * 200; // -100px to +100px
      bubble.style.setProperty('--drift-x', `${driftAmount}px`);
      
      // Make bubble interactive
      bubble.addEventListener('click', (e) => {
        // Get bubble position and size
        const rect = bubble.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Create explosion effect
        createExplosion(x, y, size);
        
        // Mark bubble as exploding and remove
        bubble.classList.add('exploding');
        bubble.style.opacity = '0';
        bubble.style.transform = 'scale(0.2)';
        bubble.style.transition = 'all 2s ease-out';
        
        setTimeout(() => {
          bubble.remove();
        }, 200);
        
        e.stopPropagation();
      });
      
      container.appendChild(bubble);
      
      // Remove bubble after animation completes if not clicked
      if (!fromCenter) {
        setTimeout(() => {
          if (bubble.parentNode && !bubble.classList.contains('exploding')) {
            bubble.style.opacity = '0';
            bubble.style.transition = 'opacity 1s ease-out';
            setTimeout(() => bubble.remove(), 10000);
          }
        }, (duration + delay) * 10000);
      }
    }
  };

  return null; // This component doesn't render any visible elements directly
};

export default InteractiveBubbleEffect;