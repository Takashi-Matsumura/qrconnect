'use client';

import { useState, useEffect } from 'react';

interface DeviceDetectorProps {
  onMobile: React.ReactNode;
  onDesktop: React.ReactNode;
}

export default function DeviceDetector({ onMobile, onDesktop }: DeviceDetectorProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const screenWidth = window.innerWidth;
      
      const isMobileDevice = mobileRegex.test(userAgent) || screenWidth < 768;
      setIsMobile(isMobileDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (isMobile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {isMobile ? onMobile : onDesktop}
    </div>
  );
}