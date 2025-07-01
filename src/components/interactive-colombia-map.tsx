'use client';

import { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import Link from 'next/link';
import * as topojson from 'topojson-client';
import colombiaTopoJSON from '@/lib/colombia-departments.json';
import { useToast } from '@/hooks/use-toast';

const cropsOnMap = [
  {
    slug: 'lechuga',
    coordinates: [-73.5, 5.0] as [number, number],
    name: 'Lechuga',
    emoji: '🥬',
  },
  {
    slug: 'tomate',
    coordinates: [-76.5, 3.4] as [number, number],
    name: 'Tomate',
    emoji: '🍅',
  },
  {
    slug: 'maiz',
    coordinates: [-75.2, 8.7] as [number, number],
    name: 'Maíz',
    emoji: '🌽',
  },
];

const colombiaGeoJSON = topojson.feature(colombiaTopoJSON as any, colombiaTopoJSON.objects.COL_adm1 as any);

export function InteractiveColombiaMap() {
  const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);
  const { toast } = useToast();

  const handleDepartmentClick = (deptName: string) => {
    toast({
      title: "Funcionalidad en desarrollo",
      description: `Próximamente podrás ver información detallada para el departamento de ${deptName}.`,
    })
  }

  return (
    <div className="relative bg-blue-100/50">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 2300,
          center: [-74, 4.5],
        }}
        style={{ width: '100%', height: 'auto' }}
        onMouseMove={(e) => {
            if (tooltip) {
                setTooltip({ ...tooltip, x: e.clientX, y: e.clientY });
            }
        }}
      >
        <Geographies geography={colombiaGeoJSON}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleDepartmentClick(geo.properties.NAME_1)}
                onMouseEnter={(e) => {
                  const { NAME_1: name } = geo.properties;
                  setTooltip({ content: name, x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => {
                  setTooltip(null);
                }}
                className="cursor-pointer"
                style={{
                  default: {
                    fill: 'hsl(var(--primary) / 0.2)',
                    stroke: 'hsl(var(--primary))',
                    strokeWidth: 0.75,
                    outline: 'none',
                  },
                  hover: {
                    fill: 'hsl(var(--accent))',
                    stroke: 'hsl(var(--primary))',
                    strokeWidth: 1,
                    outline: 'none',
                  },
                  pressed: {
                    fill: 'hsl(var(--accent-foreground))',
                    stroke: 'hsl(var(--primary))',
                    strokeWidth: 1,
                    outline: 'none',
                  },
                }}
              />
            ))
          }
        </Geographies>
        {cropsOnMap.map(({ name, coordinates, slug, emoji }) => (
            <Marker key={name} coordinates={coordinates}>
                <Link href={`/cultivos/${slug}`}>
                    <g
                        onMouseEnter={(e) => {
                            setTooltip({ content: `Cultivo: ${name}`, x: e.clientX, y: e.clientY });
                        }}
                        onMouseLeave={() => {
                            setTooltip(null);
                        }}
                        className="cursor-pointer group"
                    >
                        <circle r="16" fill="hsl(var(--card))" stroke="hsl(var(--card-foreground) / 0.5)" strokeWidth={1} className="group-hover:stroke-primary transition-colors" />
                        <text
                            textAnchor="middle"
                            y="7"
                            className="text-xl group-hover:scale-125 transition-transform duration-200 origin-center select-none"
                        >
                            {emoji}
                        </text>
                    </g>
                </Link>
            </Marker>
        ))}
      </ComposableMap>
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(15px, 15px)',
            pointerEvents: 'none',
          }}
          className="z-50 bg-card text-card-foreground p-2 rounded-md shadow-lg text-sm font-semibold border"
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}
