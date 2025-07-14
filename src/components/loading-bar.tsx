"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function LoadingBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(0);
    
    // Quick progress simulation for instant feel
    const timer1 = setTimeout(() => setProgress(60), 50);
    const timer2 = setTimeout(() => setProgress(90), 100);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setLoading(false), 100);
    }, 200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-200 ease-out shadow-sm"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default LoadingBar;
