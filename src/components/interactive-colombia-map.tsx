
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import colombiaGeoJSON from '@/lib/colombia-departments.json';
import { useToast } from '@/hooks/use-toast';

// Corrige el problema del icono predeterminado en Leaflet con bundlers como Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const cropsOnMap = [
  {
    slug: 'lechuga',
    coordinates: [5.0, -73.5] as [number, number],
    name: 'Lechuga',
    emoji: '🥬',
  },
  {
    slug: 'tomate',
    coordinates: [3.4, -76.5] as [number, number],
    name: 'Tomate',
    emoji: '🍅',
  },
  {
    slug: 'maiz',
    coordinates: [8.7, -75.2] as [number, number],
    name: 'Maíz',
    emoji: '🌽',
  },
  {
    slug: 'papa',
    coordinates: [5.4, -73.0] as [number, number],
    name: 'Papa',
    emoji: '🥔',
  },
  {
    slug: 'cafe',
    coordinates: [4.8, -75.7] as [number, number],
    name: 'Café',
    emoji: '☕',
  },
  {
    slug: 'banano',
    coordinates: [10.5, -75.0] as [number, number],
    name: 'Banano',
    emoji: '🍌',
  },
];


export function InteractiveColombiaMap() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [4.5, -74],
        zoom: 5.5,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const geoJsonLayer = L.geoJSON(colombiaGeoJSON as any, {
        style: {
          color: 'hsl(var(--primary))',
          weight: 1,
          opacity: 0.8,
          fillColor: 'hsl(var(--primary) / 0.2)',
          fillOpacity: 0.5,
        },
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: (e) => {
              const target = e.target;
              target.setStyle({
                weight: 2,
                color: 'hsl(var(--accent-foreground))',
                fillColor: 'hsl(var(--accent))',
              });
              target.bindTooltip(feature.properties.NOMBRE_DPT).openTooltip();
            },
            mouseout: (e) => {
              geoJsonLayer.resetStyle(e.target);
              e.target.closeTooltip();
            },
            click: () => {
                 toast({
                    title: "Funcionalidad en desarrollo",
                    description: `Próximamente podrás ver información detallada para el departamento de ${feature.properties.NOMBRE_DPT}.`,
                })
            },
          });
        },
      }).addTo(map);

      cropsOnMap.forEach(({ name, coordinates, slug, emoji }) => {
        const icon = L.divIcon({
          html: `<div class="bg-card rounded-full w-8 h-8 flex items-center justify-center text-xl shadow-md border border-card-foreground/50">${emoji}</div>`,
          className: 'bg-transparent border-none',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker(coordinates, { icon }).addTo(map);
        marker.bindTooltip(`Cultivo: ${name}`);
        marker.on('click', () => {
          window.location.href = `/cultivos/${slug}`;
        });
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [toast]);

  return <div ref={mapContainerRef} style={{ height: '600px', width: '100%' }} className="rounded-lg bg-muted z-0" />;
}
