'use client';

import { useState, useRef, useActionState } from 'react';
import { detectPlantAction } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/submit-button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from 'next/image';
import { UploadCloud, CheckCircle2, AlertTriangle, Leaf, HeartPulse, Scale, Sun, Droplets, Lightbulb } from 'lucide-react';

export default function PlantDetector() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formState, formAction] = useActionState(detectPlantAction, undefined);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if(e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
        // manually trigger change event
        const changeEvent = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(changeEvent);
      }
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Analizador de Plantas</CardTitle>
        <CardDescription>Carga una imagen para comenzar el análisis.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div>
            <Label 
              htmlFor="plant-image"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="Vista previa de la planta" width={256} height={256} className="h-full w-auto object-contain rounded-lg" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Haz clic para subir</span> o arrastra y suelta</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, o WEBP</p>
                </div>
              )}
            </Label>
            <Input id="plant-image" name="image" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} ref={fileInputRef}/>
          </div>
          
          <SubmitButton className="w-full" pendingText="Analizando...">
            Identificar Planta
          </SubmitButton>
        </form>

        {formState?.error && (
            <Alert variant="destructive" className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{formState.error}</AlertDescription>
            </Alert>
        )}

        {formState?.result && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <h3 className="text-xl font-headline font-bold text-center">Resultados del Análisis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><Leaf className="mr-2 text-primary" /> Identificación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Nombre Común:</strong> {formState.result.speciesIdentification.commonName}</p>
                  <p><strong>Nombre Latín:</strong> <span className="italic">{formState.result.speciesIdentification.latinName}</span></p>
                  <div className="flex items-center">
                    <Scale className="mr-2 h-4 w-4 text-muted-foreground" />
                    <strong>Confianza:</strong>
                    <div className="w-full bg-muted rounded-full h-2.5 ml-2">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${formState.result.speciesIdentification.confidence * 100}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                   <CardTitle className="flex items-center"><HeartPulse className="mr-2 text-primary" /> Estado de Salud</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center">
                    {formState.result.healthAssessment.isHealthy ? 
                      <><CheckCircle2 className="mr-2 text-green-500" /> <span className="font-bold">Saludable</span></> :
                      <><AlertTriangle className="mr-2 text-yellow-500" /> <span className="font-bold">Necesita atención</span></>
                    }
                  </div>
                  <p className="text-muted-foreground">{formState.result.healthAssessment.issues}</p>
                </CardContent>
              </Card>
            </div>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Lightbulb className="mr-2 text-primary" /> Recomendaciones de Cuidado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Droplets className="mr-3 h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold">Riego</h4>
                    <p className="text-muted-foreground">{formState.result.careRecommendations.watering}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Sun className="mr-3 h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold">Luz Solar</h4>
                    <p className="text-muted-foreground">{formState.result.careRecommendations.sunlight}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="mr-3 h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold">Consejos Generales</h4>
                    <p className="text-muted-foreground">{formState.result.careRecommendations.generalTips}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
