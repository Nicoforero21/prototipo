
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { Button } from './ui/button';

const cropsOnMap = [
  {
    slug: 'lechuga',
    position: { lat: 4.7110, lng: -74.0721 }, // Bogotá
    name: 'Lechuga',
    emoji: '🥬',
  },
  {
    slug: 'tomate',
    position: { lat: 3.4516, lng: -76.5320 }, // Cali
    name: 'Tomate',
    emoji: '🍅',
  },
  {
    slug: 'maiz',
    position: { lat: 6.2442, lng: -75.5812 }, // Medellín
    name: 'Maíz',
    emoji: '🌽',
  },
];

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function InteractiveColombiaMap() {
  const [selectedCrop, setSelectedCrop] = useState<typeof cropsOnMap[0] | null>(null);

  if (!API_KEY) {
    return (
      <div className="h-96 flex items-center justify-center bg-muted">
        <p className="text-destructive">La clave de API de Google Maps no está configurada.</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ height: '500px', width: '100%' }}>
        <Map
          defaultCenter={{ lat: 4.5709, lng: -74.2973 }}
          defaultZoom={5}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId={'a1b2c3d4e5f6g7h8'} // Custom map ID for styling
        >
          {cropsOnMap.map((crop) => (
            <AdvancedMarker
              key={crop.slug}
              position={crop.position}
              onClick={() => setSelectedCrop(crop)}
            >
              <Pin background={'hsl(var(--primary))'} borderColor={'hsl(var(--primary-foreground))'} glyphColor={'hsl(var(--primary-foreground))'}>
                <span className="text-2xl">{crop.emoji}</span>
              </Pin>
            </AdvancedMarker>
          ))}

          {selectedCrop && (
            <InfoWindow
              position={selectedCrop.position}
              onCloseClick={() => setSelectedCrop(null)}
            >
              <div className="p-2 text-center">
                <h3 className="font-bold font-headline text-lg">{selectedCrop.name}</h3>
                <p className="text-2xl my-2">{selectedCrop.emoji}</p>
                <Button asChild size="sm">
                  <Link href={`/cultivos/${selectedCrop.slug}`}>Ver detalles</Link>
                </Button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
