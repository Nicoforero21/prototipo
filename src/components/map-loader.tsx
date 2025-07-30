'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

export function MapLoader() {
  const InteractiveColombiaMap = useMemo(() => dynamic(
    () => import('@/components/interactive-colombia-map').then((mod) => mod.InteractiveColombiaMap),
    { 
      ssr: false,
      loading: () => <div className="h-[600px] w-full bg-muted animate-pulse rounded-lg" />
    }
  ), []);

  return <InteractiveColombiaMap />;
}
