"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { FullScreenLoading } from './ui/loading';

export function NavigationLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };

    const handleComplete = () => {
      setLoading(false);
    };

    // Show loading when route changes
    handleStart();
    
    // Hide loading after a short delay to allow page to render
    const timer = setTimeout(() => {
      handleComplete();
    }, 500);

    return () => {
      clearTimeout(timer);
      handleComplete();
    };
  }, [pathname, searchParams]);

  if (!loading) return null;

  return <FullScreenLoading text="กำลังโหลดหน้า..." />;
}

export default NavigationLoading;
