import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { mockCrops } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import { MapLoader } from '@/components/map-loader';


export default function Home() {
  const difficultyColors = {
    Fácil: 'bg-green-500',
    Media: 'bg-yellow-500',
    Difícil: 'bg-red-500',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16">
        <h1 className="text-5xl font-headline font-bold text-primary mb-4">
          Cultiva Colombia
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Conoce, elige y cuida cultivos adecuados para tu región. Fomentamos la soberanía alimentaria con herramientas accesibles, educativas e interactivas.
        </p>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-headline font-bold text-center mb-2">Mapa Interactivo de Cultivos</h2>
        <p className="text-center text-muted-foreground mb-8">Explora los cultivos ideales para diferentes zonas. Haz clic en un marcador para más detalles.</p>
        <Card className="overflow-hidden shadow-lg rounded-lg">
           <MapLoader />
        </Card>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-headline font-bold text-center mb-8">Cultivos Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCrops.map((crop) => (
            <Card key={crop.slug} className="flex flex-col hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0">
                <Image 
                  src={crop.imageUrl} 
                  alt={crop.name} 
                  width={400} 
                  height={250} 
                  className="w-full h-48 object-cover rounded-t-lg"
                  data-ai-hint={crop.aiHint}
                />
              </CardHeader>
              <CardContent className="flex-grow pt-6">
                <div className="flex justify-between items-start">
                  <CardTitle className="font-headline text-2xl">{crop.name}</CardTitle>
                  <Badge className={`${difficultyColors[crop.difficulty]} text-white`}>{crop.difficulty}</Badge>
                </div>
                <p className="text-muted-foreground mt-2">{crop.shortDescription}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/cultivos/${crop.slug}`}>
                    Ver Ficha Técnica <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
