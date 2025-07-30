'use client';

import { useState, useEffect } from 'react';
import { MapContainer, GeoJSON, Marker, Tooltip, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import * as topojson from 'topojson-client';
import type { Topology } from 'topojson-specification';
import { useToast } from '@/hooks/use-toast';
import colombiaTopoJSON from '@/lib/colombia-departments.json';
import type { GeoJsonObject } from 'geojson';

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


const cropsOnMap = [
  { slug: 'lechuga', coordinates: [5.0, -73.5] as [number, number], name: 'Lechuga', emoji: '🥬' },
  { slug: 'tomate', coordinates: [3.4, -76.5] as [number, number], name: 'Tomate', emoji: '🍅' },
  { slug: 'maiz', coordinates: [8.7, -75.2] as [number, number], name: 'Maíz', emoji: '🌽' },
];

const colombiaGeoJSON = topojson.feature(
  colombiaTopoJSON as unknown as Topology,
  colombiaTopoJSON.objects.COL_adm1
) as GeoJsonObject;


export function InteractiveColombiaMap() {
  const { toast } = useToast();

  const handleDepartmentClick = (deptName: string) => {
    toast({
      title: "Funcionalidad en desarrollo",
      description: `Próximamente podrás ver información detallada para el departamento de ${deptName}.`,
    });
  };

  const geoJsonStyle = {
    fillColor: 'hsl(var(--primary) / 0.2)',
    weight: 1,
    opacity: 1,
    color: 'hsl(var(--primary))',
    fillOpacity: 0.5
  };
  
  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties && feature.properties.NAME_1) {
      layer.on({
        mouseover: (e) => {
          e.target.setStyle({
            fillColor: 'hsl(var(--accent))',
            weight: 2,
          });
          e.target.bringToFront();
        },
        mouseout: (e) => {
          e.target.setStyle(geoJsonStyle);
        },
        click: () => handleDepartmentClick(feature.properties.NAME_1)
      });
      layer.bindTooltip(feature.properties.NAME_1, { sticky: true });
    }
  };

  const createEmojiIcon = (emoji: string) => {
    return L.divIcon({
      html: `<div style="font-size: 24px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${emoji}</div>`,
      className: 'bg-transparent border-0',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  }

  return (
      <MapContainer 
        center={[4.5, -74]} 
        zoom={6} 
        scrollWheelZoom={true} 
        style={{ height: '600px', width: '100%' }}
        className='z-0'
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON 
          data={colombiaGeoJSON} 
          style={geoJsonStyle}
          onEachFeature={onEachFeature}
        />
        {cropsOnMap.map(({ name, coordinates, slug, emoji }) => (
          <Marker 
            key={name} 
            position={coordinates}
            icon={createEmojiIcon(emoji)}
            eventHandlers={{
                click: () => {
                    window.location.href = `/cultivos/${slug}`;
                }
            }}
          >
            <Tooltip>Cultivo: {name}</Tooltip>
          </Marker>
        ))}
      </MapContainer>
  );
}
