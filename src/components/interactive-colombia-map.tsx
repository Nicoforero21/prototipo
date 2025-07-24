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
import type { Topology } from 'topojson-specification';
import { useToast } from '@/hooks/use-toast';
import colombiaTopoJSON from '@/lib/colombia-departments.json';
import Image from 'next/image';

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

const colombiaGeoJSON = topojson.feature(
  colombiaTopoJSON as unknown as Topology,
  colombiaTopoJSON.objects.COL_adm1
);

export function InteractiveColombiaMap() {
  const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);
  const { toast } = useToast();

  const handleDepartmentClick = (deptName: string) => {
    toast({
      title: "Funcionalidad en desarrollo",
      description: `Próximamente podrás ver información detallada para el departamento de ${deptName}.`,
    })
  }
  
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (tooltip) {
        setTooltip({ ...tooltip, x: e.clientX, y: e.clientY });
    }
  }

  const handleMouseLeaveMap = () => {
      setTooltip(null);
  }

  return (
    <div className="relative">
       <Image 
        src="https://thumbs.dreamstime.com/b/mapa-f%C3%ADsico-de-colombia-altamente-detallado-en-formato-vector-con-todas-las-formas-ayuda-regiones-y-grandes-ciudades-188053912.jpg"
        alt="Mapa físico de Colombia"
        layout="fill"
        objectFit="cover"
        className="opacity-50"
       />
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 2300,
          center: [-74, 4.5],
        }}
        style={{ width: '100%', height: 'auto' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeaveMap}
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
                    fill: 'hsl(var(--primary) / 0.1)',
                    stroke: 'hsl(var(--primary) / 0.5)',
                    strokeWidth: 0.75,
                    outline: 'none',
                  },
                  hover: {
                    fill: 'hsl(var(--accent) / 0.3)',
                    stroke: 'hsl(var(--primary))',
                    strokeWidth: 1,
                    outline: 'none',
                  },
                  pressed: {
                    fill: 'hsl(var(--accent-foreground) / 0.3)',
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
                <Link href={`/cultivos/${slug}`} passHref>
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
