'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Calendar, Droplets, Sprout, Wheat } from 'lucide-react';
import { mockCrops } from '@/lib/data';
import { Label } from '@/components/ui/label';
import type { Crop } from '@/types';
import Link from 'next/link';

// Extend Crop type for dashboard specific properties
interface TrackedCrop extends Crop {
  stage: number;
  totalStages: number;
  nextWatering: string;
}

// Initial tracked crops, in a real app this would come from a database
const initialTrackedCrops: TrackedCrop[] = [
  // This will now be populated from user data
];

export default function DashboardPage() {
  const [trackedCrops, setTrackedCrops] = useState<TrackedCrop[]>(initialTrackedCrops);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      // In a real app, you would fetch user-specific data here.
      // For now, we'll simulate it by checking if the user has added crops in a previous step,
      // which would be stored in localStorage for this demo or fetched from a DB.
      
      // Let's create a temporary mock of what the DB would return.
      const userCropSlugs = ['lechuga', 'tomate']; // This would be fetched from the user's profile
      
      const userCrops = mockCrops
        .filter(crop => userCropSlugs.includes(crop.slug))
        .map(crop => ({
          ...crop,
          stage: Math.ceil(Math.random() * crop.lifecycle.length),
          totalStages: crop.lifecycle.length,
          nextWatering: `En ${Math.ceil(Math.random() * 3)} días`,
        }));
      
      setTrackedCrops(userCrops);
      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">
          Cargando tu Panel de Cultivo...
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">
          Mi Panel de Cultivo
        </h1>
        <p className="text-lg text-muted-foreground">
          Aquí puedes seguir el progreso de tus plantas, ver recordatorios y registrar tus notas.
        </p>
      </div>

      {trackedCrops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trackedCrops.map((crop) => (
            <Card key={crop.slug} className="flex flex-col hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Image 
                  src={crop.imageUrl} 
                  alt={crop.name} 
                  width={400} 
                  height={250} 
                  className="w-full h-40 object-cover rounded-t-lg"
                  data-ai-hint={crop.aiHint}
                />
                <CardTitle className="font-headline pt-4">{crop.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div>
                  <Label className="text-sm font-medium">Progreso del Cultivo</Label>
                  <Progress value={(crop.stage / crop.totalStages) * 100} className="w-full mt-1" />
                  <p className="text-xs text-muted-foreground mt-1">{crop.lifecycle[crop.stage-1]}</p>
                </div>
                <div className="flex items-center text-sm text-muted-foreground bg-accent/50 p-3 rounded-md">
                  <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Próximo riego: <span className="font-bold">{crop.nextWatering}</span></span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground bg-yellow-100 p-3 rounded-md border border-yellow-200">
                  <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
                  <span>Alerta: Posible riesgo de pulgones en la zona.</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" /> Ver registro y notas
                </Button>
              </CardFooter>
            </Card>
          ))}
          <Card className="flex flex-col items-center justify-center border-2 border-dashed bg-muted/50 hover:bg-muted transition-colors">
              <CardHeader className="text-center">
                  <CardTitle className="font-headline">Añadir Nuevo Cultivo</CardTitle>
                  <CardDescription>Explora y añade más plantas a tu panel.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Button asChild>
                    <Link href="/">+ Explorar Cultivos</Link>
                  </Button>
              </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 text-center p-12">
            <CardHeader>
                <Wheat className="h-16 w-16 mx-auto text-muted-foreground" />
                <CardTitle className="font-headline mt-4">Tu panel de cultivo está vacío</CardTitle>
                <CardDescription className="mt-2">
                    ¡Empieza por explorar los cultivos disponibles y añade el primero a tu panel para hacerle seguimiento!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/">
                        <Sprout className="mr-2 h-4 w-4" />
                        Explorar Cultivos
                    </Link>
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

    