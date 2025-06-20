import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Calendar, Droplets } from 'lucide-react';
import { mockCrops } from '@/lib/data';

// Mock tracked crops, in a real app this would come from a database
const trackedCrops = [
  { ...mockCrops[0], stage: 3, totalStages: 4, nextWatering: 'Mañana' },
  { ...mockCrops[1], stage: 2, totalStages: 5, nextWatering: 'En 2 días' },
];

export default function DashboardPage() {
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
                <Button>+ Explorar Cultivos</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
