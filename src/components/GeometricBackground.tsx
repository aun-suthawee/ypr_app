import React, { useMemo, useEffect, useState } from 'react';
import '../styles/geometric-background.css';

interface GeometricBackgroundProps {
  density?: 'light' | 'medium' | 'heavy';
  isMobile?: boolean;
}

const GeometricBackground: React.FC<GeometricBackgroundProps> = ({ 
  density = 'medium',
  isMobile = false
}) => {
  const [performanceMode, setPerformanceMode] = useState<'high' | 'medium' | 'low'>('high');

  // Performance detection
  useEffect(() => {
    // Check if device prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Simple performance heuristic
    const isLowEndDevice = () => {
      // Check for common low-end device indicators
      const hardwareConcurrency = navigator.hardwareConcurrency || 1;
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 1;
      
      return hardwareConcurrency <= 2 || memory <= 2;
    };

    if (prefersReducedMotion || isLowEndDevice()) {
      setPerformanceMode('low');
    } else if (isMobile) {
      setPerformanceMode('medium');
    }
  }, [isMobile]);

  // Memoize shape counts based on performance mode
  const counts = useMemo(() => {
    const performanceMultiplier = {
      'high': 1,
      'medium': 0.7,
      'low': 0.3
    }[performanceMode];

    // Reduce counts even more due to larger sizes - total 75% reduction from original
    const mobileFactor = isMobile ? 0.3 : 1; // Mobile gets 30% of desktop amount
    const reductionFactor = 0.25 * performanceMultiplier; // Apply performance-based reduction
    
    switch (density) {
      case 'light': return { 
        squares: Math.floor(12 * reductionFactor * mobileFactor),
        triangles: Math.floor(10 * reductionFactor * mobileFactor),
        circles: Math.floor(10 * reductionFactor * mobileFactor),
        hexagons: Math.floor(6 * reductionFactor * mobileFactor),
        diamonds: Math.floor(8 * reductionFactor * mobileFactor),
        pentagons: Math.floor(5 * reductionFactor * mobileFactor),
        lines: Math.floor(6 * reductionFactor * mobileFactor),
        dots: Math.floor(4 * reductionFactor * mobileFactor)
      };
      case 'medium': return { 
        squares: Math.floor(20 * reductionFactor * mobileFactor),
        triangles: Math.floor(16 * reductionFactor * mobileFactor),
        circles: Math.floor(16 * reductionFactor * mobileFactor),
        hexagons: Math.floor(12 * reductionFactor * mobileFactor),
        diamonds: Math.floor(14 * reductionFactor * mobileFactor),
        pentagons: Math.floor(10 * reductionFactor * mobileFactor),
        lines: Math.floor(12 * reductionFactor * mobileFactor),
        dots: Math.floor(6 * reductionFactor * mobileFactor)
      };
      case 'heavy': return { 
        squares: Math.floor(28 * reductionFactor * mobileFactor),
        triangles: Math.floor(24 * reductionFactor * mobileFactor),
        circles: Math.floor(24 * reductionFactor * mobileFactor),
        hexagons: Math.floor(20 * reductionFactor * mobileFactor),
        diamonds: Math.floor(22 * reductionFactor * mobileFactor),
        pentagons: Math.floor(16 * reductionFactor * mobileFactor),
        lines: Math.floor(20 * reductionFactor * mobileFactor),
        dots: Math.floor(10 * reductionFactor * mobileFactor)
      };
      default: return { 
        squares: Math.floor(20 * reductionFactor * mobileFactor), 
        triangles: Math.floor(16 * reductionFactor * mobileFactor), 
        circles: Math.floor(16 * reductionFactor * mobileFactor), 
        hexagons: Math.floor(12 * reductionFactor * mobileFactor), 
        diamonds: Math.floor(14 * reductionFactor * mobileFactor), 
        pentagons: Math.floor(10 * reductionFactor * mobileFactor), 
        lines: Math.floor(12 * reductionFactor * mobileFactor), 
        dots: Math.floor(6 * reductionFactor * mobileFactor) 
      };
    }
  }, [density, isMobile, performanceMode]);
  const colors = [
    'blue-light', 'blue-medium', 'blue-dark',
    'purple-light', 'purple-medium', 'purple-dark',
    'indigo-light', 'indigo-medium', 'indigo-dark',
    'cyan-light', 'cyan-medium', 'cyan-dark',
    'emerald-light', 'emerald-medium', 'emerald-dark',
    'teal-light', 'teal-medium', 'teal-dark',
    'violet-light', 'violet-medium', 'violet-dark',
    'pink-light', 'pink-medium', 'pink-dark'
  ];
  const borderColors = [
    'border-blue-light', 'border-blue-medium', 'border-blue-dark',
    'border-purple-light', 'border-purple-medium', 'border-purple-dark',
    'border-indigo-light', 'border-indigo-medium', 'border-indigo-dark',
    'border-cyan-light', 'border-cyan-medium', 'border-cyan-dark',
    'border-emerald-light', 'border-emerald-medium', 'border-emerald-dark',
    'border-teal-light', 'border-teal-medium', 'border-teal-dark',
    'border-violet-light', 'border-violet-medium', 'border-violet-dark',
    'border-pink-light', 'border-pink-medium', 'border-pink-dark'
  ];
  const sizes = ['size-xs', 'size-sm', 'size-md', 'size-lg', 'size-xl', 'size-2xl', 'size-3xl'];
  const triangleSizes = ['triangle-xs', 'triangle-sm', 'triangle-md', 'triangle-lg', 'triangle-xl'];
  const outlineTriangleSizes = ['outline-triangle-xs', 'outline-triangle-sm', 'outline-triangle-md', 'outline-triangle-lg'];
  const animations = [
    'animate-spin-slow', 
    'animate-pulse', 
    'animate-bounce-slow', 
    'animate-float', 
    'animate-float-delayed',
    'animate-glow',
    'animate-color-shift'
  ];
  const rotations = ['rotate-0', 'rotate-15', 'rotate-30', 'rotate-45', 'rotate-60', 'rotate-90'];
  const delays = ['delay-0', 'delay-1', 'delay-2', 'delay-3', 'delay-4', 'delay-5'];

  // Helper function to get random item from array
  const random = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  // Generate random position that doesn't overlap with content area
  const getRandomPosition = () => {
    // Create more positions for better distribution - expanded to 25x25 grid
    const gridPositions = [];
    
    // Create a 25x25 grid of positions for more variety
    for (let row = 0; row <= 25; row++) {
      for (let col = 0; col <= 25; col++) {
        // Skip center area where main content is (roughly 25-75% both directions)
        // But allow some shapes in the content area with lower probability
        const inContentArea = (row >= 6 && row <= 18 && col >= 6 && col <= 18);
        
        // Include content area positions with 30% probability for subtle background effect
        if (!inContentArea || Math.random() < 0.3) {
          gridPositions.push({
            top: `${(row * 4)}%`,
            left: `${(col * 4)}%`
          });
        }
      }
    }
    
    const position = gridPositions[Math.floor(Math.random() * gridPositions.length)];
    return position;
  };

  // Generate squares
  const squares = Array.from({ length: counts.squares }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`square-${i}`}
        className={`geo-square ${random(colors)} ${random(sizes)} ${random(animations)} ${random(rotations)} ${random(delays)}`}
        style={position}
      />
    );
  });

  // Generate triangles
  const triangles = Array.from({ length: counts.triangles }, (_, i) => {
    const position = getRandomPosition();
    const colorValue = Math.random();
    const borderColor = colorValue < 0.125 
      ? 'rgba(59, 130, 246, 0.08)'    // Blue - much lighter
      : colorValue < 0.25 
      ? 'rgba(147, 51, 234, 0.08)'    // Purple - much lighter
      : colorValue < 0.375
      ? 'rgba(99, 102, 241, 0.08)'    // Indigo - much lighter
      : colorValue < 0.5
      ? 'rgba(6, 182, 212, 0.08)'     // Cyan - much lighter
      : colorValue < 0.625
      ? 'rgba(16, 185, 129, 0.08)'    // Emerald - much lighter
      : colorValue < 0.75
      ? 'rgba(20, 184, 166, 0.08)'    // Teal - much lighter
      : colorValue < 0.875
      ? 'rgba(139, 92, 246, 0.08)'    // Violet - much lighter
      : 'rgba(236, 72, 153, 0.08)';   // Pink - much lighter
    
    return (
      <div
        key={`triangle-${i}`}
        className={`geo-triangle ${random(triangleSizes)} ${random(animations)} ${random(delays)}`}
        style={{
          ...position,
          borderBottomColor: borderColor,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent'
        }}
      />
    );
  });

  // Generate circles
  const circles = Array.from({ length: counts.circles }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`circle-${i}`}
        className={`geo-circle ${random(colors)} ${random(sizes)} ${random(animations)} ${random(delays)}`}
        style={position}
      />
    );
  });

  // Generate hexagons
  const hexagons = Array.from({ length: counts.hexagons }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`hexagon-${i}`}
        className={`geo-hexagon ${random(colors)} ${random(sizes)} ${random(animations)} ${random(rotations)} ${random(delays)}`}
        style={position}
      />
    );
  });

  // Generate diamonds
  const diamonds = Array.from({ length: counts.diamonds }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`diamond-${i}`}
        className={`geo-diamond ${random(colors)} ${random(sizes)} ${random(animations)} ${random(delays)}`}
        style={position}
      />
    );
  });

  // Generate pentagons
  const pentagons = Array.from({ length: counts.pentagons }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`pentagon-${i}`}
        className={`geo-pentagon ${random(colors)} ${random(sizes)} ${random(animations)} ${random(rotations)} ${random(delays)}`}
        style={position}
      />
    );
  });

  // Generate lines
  const lines = Array.from({ length: counts.lines }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`line-${i}`}
        className={`geo-line ${random(colors)} line-md ${random(animations)} ${random(rotations)} ${random(delays)}`}
        style={position}
      />
    );
  });

  // Generate dots clusters
  const dotClusters = Array.from({ length: counts.dots }, (_, clusterIndex) => {
    const position = getRandomPosition();
    return (
      <div
        key={`dots-cluster-${clusterIndex}`}
        style={position}
      >
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }, (_, dotIndex) => (
            <div
              key={`dot-${clusterIndex}-${dotIndex}`}
              className={`geo-dot ${random(colors)} size-xs animate-pulse ${random(delays)}`}
            />
          ))}
        </div>
      </div>
    );
  });

  // Generate additional complex shapes
  const stars = Array.from({ length: Math.floor(counts.pentagons / 2) }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`star-${i}`}
        className={`geo-star ${random(colors)} ${random(sizes)} ${random(animations)} ${random(rotations)} ${random(delays)}`}
        style={position}
      />
    );
  });

  // Generate complex hexagonal shapes
  const complexHexes = Array.from({ length: Math.floor(counts.hexagons / 3) }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`complex-hex-${i}`}
        className={`geo-complex-hex ${random(colors)} ${random(sizes)} ${random(animations)} ${random(rotations)} ${random(delays)}`}
        style={position}
      />
    );
  });

  // Generate octagons
  const octagons = Array.from({ length: Math.floor(counts.hexagons / 4) }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`octagon-${i}`}
        className={`geo-octagon ${random(colors)} ${random(sizes)} ${random(animations)} ${random(rotations)} ${random(delays)}`}
        style={position}
      />
    );
  });

  // Generate crosses
  const crosses = Array.from({ length: Math.floor(counts.diamonds / 4) }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`cross-${i}`}
        className={`geo-cross ${random(colors)} ${random(sizes)} ${random(animations)} ${random(rotations)} ${random(delays)}`}
        style={position}
      />
    );
  });

  // Generate arrows
  const arrows = Array.from({ length: Math.floor(counts.lines / 3) }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`arrow-${i}`}
        className={`geo-arrow ${random(colors)} ${random(sizes)} ${random(animations)} ${random(rotations)} ${random(delays)}`}
        style={position}
      />
    );
  });

  // Generate small scattered dots
  const scatteredDots = Array.from({ length: counts.dots * 4 }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`scattered-dot-${i}`}
        className={`geo-dot ${random(colors)} size-xs animate-pulse ${random(delays)}`}
        style={position}
      />
    );
  });

  // Generate outline shapes (border only, no fill)
  const outlineSquares = Array.from({ length: Math.floor(counts.squares / 2) }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`outline-square-${i}`}
        className={`geo-outline-square ${random(borderColors)} ${random(sizes)} ${random(animations)} ${random(rotations)} ${random(delays)}`}
        style={position}
      />
    );
  });

  const outlineCircles = Array.from({ length: Math.floor(counts.circles / 2) }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`outline-circle-${i}`}
        className={`geo-outline-circle ${random(borderColors)} ${random(sizes)} ${random(animations)} ${random(delays)}`}
        style={position}
      />
    );
  });

  const outlineHexagons = Array.from({ length: Math.floor(counts.hexagons / 2) }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`outline-hexagon-${i}`}
        className={`geo-outline-hexagon ${random(borderColors)} ${random(sizes)} ${random(animations)} ${random(rotations)} ${random(delays)}`}
        style={position}
      />
    );
  });

  const outlineDiamonds = Array.from({ length: Math.floor(counts.diamonds / 2) }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`outline-diamond-${i}`}
        className={`geo-outline-diamond ${random(borderColors)} ${random(sizes)} ${random(animations)} ${random(delays)}`}
        style={position}
      />
    );
  });

  const outlineTriangles = Array.from({ length: Math.floor(counts.triangles / 2) }, (_, i) => {
    const position = getRandomPosition();
    const colorValue = Math.random();
    const borderColor = colorValue < 0.125 
      ? 'rgba(59, 130, 246, 0.6)'    // Blue
      : colorValue < 0.25 
      ? 'rgba(147, 51, 234, 0.6)'    // Purple
      : colorValue < 0.375
      ? 'rgba(99, 102, 241, 0.6)'    // Indigo
      : colorValue < 0.5
      ? 'rgba(6, 182, 212, 0.6)'     // Cyan
      : colorValue < 0.625
      ? 'rgba(16, 185, 129, 0.6)'    // Emerald
      : colorValue < 0.75
      ? 'rgba(20, 184, 166, 0.6)'    // Teal
      : colorValue < 0.875
      ? 'rgba(139, 92, 246, 0.6)'    // Violet
      : 'rgba(236, 72, 153, 0.6)';   // Pink
    
    return (
      <div
        key={`outline-triangle-${i}`}
        className={`geo-outline-triangle ${random(outlineTriangleSizes)} ${random(animations)} ${random(delays)}`}
        style={{
          ...position,
          borderBottomColor: borderColor,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent'
        }}
      />
    );
  });

  const outlineStars = Array.from({ length: Math.floor(counts.pentagons / 3) }, (_, i) => {
    const position = getRandomPosition();
    return (
      <div
        key={`outline-star-${i}`}
        className={`geo-outline-star ${random(borderColors)} ${random(sizes)} ${random(animations)} ${random(rotations)} ${random(delays)}`}
        style={position}
      />
    );
  });

  return (
    <div className="geometric-background">
      {squares}
      {triangles}
      {circles}
      {hexagons}
      {diamonds}
      {pentagons}
      {lines}
      {dotClusters}
      {stars}
      {complexHexes}
      {octagons}
      {crosses}
      {arrows}
      {scatteredDots}
      {outlineSquares}
      {outlineCircles}
      {outlineHexagons}
      {outlineDiamonds}
      {outlineTriangles}
      {outlineStars}
      {arrows}
      {scatteredDots}
      
      {/* Gradient overlay */}
      <div className="geometric-overlay" />
    </div>
  );
};

export default GeometricBackground;
