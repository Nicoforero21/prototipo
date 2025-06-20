import PlantDetector from '@/components/plant-detector';

export default function DetectarPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold text-primary mb-2">
            Detección de Especies por IA
          </h1>
          <p className="text-lg text-muted-foreground">
            Sube una foto de una planta y nuestra inteligencia artificial te ayudará a identificarla y a conocer su estado de salud.
          </p>
        </div>
        
        <PlantDetector />
      </div>
    </div>
  );
}
