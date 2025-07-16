
'use server';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Calendar, Droplets, Sprout, Wheat } from 'lucide-react';
import { mockCrops } from '@/lib/data';
import type { Crop } from '@/types';
import Link from 'next/link';
import { getAuthenticatedUser } from '@/lib/firebase-admin';
import { getUserByUid } from '@/lib/user-service';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { addCropToUser } from '@/lib/user-service';

// Extend Crop type for dashboard specific properties
interface TrackedCrop extends Crop {
  stage: number;
  totalStages: number;
  nextWatering: string;
}

export default async function DashboardPage() {
  const authUser = await getAuthenticatedUser();
  if (!authUser) {
    redirect('/login');
  }

  const user = await getUserByUid(authUser.uid);
  const userCropSlugs = user?.trackedCrops || [];
  
  const trackedCrops: TrackedCrop[] = mockCrops
    .filter(crop => userCropSlugs.includes(crop.slug))
    .map(crop => ({
      ...crop,
      stage: Math.ceil(Math.random() * crop.lifecycle.length),
      totalStages: crop.lifecycle.length,
      nextWatering: `En ${Math.ceil(Math.random() * 3)} días`,
    }));
    
  async function addAnotherCropAction() {
    'use server';
    if (!authUser) return;
    const availableCrops = mockCrops.filter(crop => !userCropSlugs.includes(crop.slug));
    if (availableCrops.length > 0) {
      await addCropToUser(authUser.uid, 'maiz');
      revalidatePath('/dashboard');
    }
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
                  <p className="text-sm font-medium text-muted-foreground">Progreso del Cultivo</p>
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
                  <form action={addAnotherCropAction}>
                    <Button type="submit">+ Explorar Cultivos</Button>
                  </form>
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
