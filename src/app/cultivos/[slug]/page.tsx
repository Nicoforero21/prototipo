'use server';
import { mockCrops } from '@/lib/data';
import type { Crop } from '@/types';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Download, HeartPulse, Share2, Sprout, Sun, Droplets, RulerHorizontal, Bug, FlaskConical, Wind } from 'lucide-react';
import { getAuthenticatedUser } from '@/lib/firebase-admin';
import { addCropToUser, hasUserCrop } from '@/lib/user-service';
import { revalidatePath } from 'next/cache';
import { SubmitButton } from '@/components/submit-button';

export async function generateStaticParams() {
  return mockCrops.map((crop) => ({
    slug: crop.slug,
  }));
}

function getCropData(slug: string): Crop | undefined {
  return mockCrops.find((crop) => crop.slug === slug);
}

const difficultyColors = {
  Fácil: 'bg-green-100 text-green-800 border-green-300',
  Media: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Difícil: 'bg-red-100 text-red-800 border-red-300',
};

export default async function CropPage({ params }: { params: { slug: string } }) {
  const crop = getCropData(params.slug);
  const user = await getAuthenticatedUser();

  if (!crop) {
    notFound();
  }
  
  const userHasCrop = user ? await hasUserCrop(user.uid, crop.slug) : false;

  async function addCropAction() {
    'use server';
    if (!user) {
      redirect('/login');
    }
    await addCropToUser(user.uid, crop.slug);
    revalidatePath('/dashboard');
    revalidatePath(`/cultivos/${crop.slug}`);
  }


  const requirements = [
    { icon: <Droplets />, label: "Riego", value: crop.requirements.watering },
    { icon: <Wind />, label: "Clima", value: crop.requirements.climate },
    { icon: <RulerHorizontal />, label: "Espacio", value: crop.requirements.space },
    { icon: <Bug />, label: "Plagas Comunes", value: crop.requirements.pests },
    { icon: <FlaskConical />, label: "Fertilizantes", value: crop.requirements.fertilizers },
  ];

  return (
    <div className="bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-4xl font-headline font-bold text-primary">{crop.name}</h1>
                    <p className="text-xl text-muted-foreground italic">{crop.latinName}</p>
                  </div>
                  <Badge variant="outline" className={`text-lg px-4 py-2 ${difficultyColors[crop.difficulty]}`}>{crop.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{crop.longDescription}</p>
                <div className="mt-6 flex space-x-2">
                    {user && (
                      <form action={addCropAction}>
                        <SubmitButton disabled={userHasCrop} pendingText="Añadiendo...">
                          <Sprout className="mr-2 h-4 w-4" /> 
                          {userHasCrop ? 'Cultivo en tu panel' : 'Añadir a mi dashboard'}
                        </SubmitButton>
                      </form>
                    )}
                    {!user && (
                       <Button asChild>
                         <a href="/login">
                          <Sprout className="mr-2 h-4 w-4" /> Inicia sesión para añadir
                         </a>
                      </Button>
                    )}
                    <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" /> Compartir
                    </Button>
                     <Button variant="outline" asChild>
                        <a href={`/guias/${crop.slug}.pdf`} download>
                            <Download className="mr-2 h-4 w-4" /> Descargar PDF
                        </a>
                    </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center"><Clock className="mr-2 text-primary"/> Ciclo de Vida</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="border-l-2 border-primary absolute h-full top-0 left-4"></div>
                  <ul className="space-y-4">
                    {crop.lifecycle.map((stage, index) => (
                      <li key={index} className="flex items-center">
                        <div className="z-10 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center mr-4">{index + 1}</div>
                        <p>{stage}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center"><CheckCircle className="mr-2 text-primary"/> Guía de Siembra</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold">En Maceta:</h4>
                  <p className="text-muted-foreground">{crop.sowingGuide.pot}</p>
                </div>
                 <div>
                  <h4 className="font-bold">En Suelo Directo:</h4>
                  <p className="text-muted-foreground">{crop.sowingGuide.soil}</p>
                </div>
                 <div>
                  <h4 className="font-bold">En Hidroponía:</h4>
                  <p className="text-muted-foreground">{crop.sowingGuide.hydroponics}</p>
                </div>
              </CardContent>
            </Card>

          </div>
          <div className="space-y-8">
            <Card className="sticky top-24">
              <Image
                src={crop.imageUrl}
                alt={crop.name}
                width={500}
                height={350}
                className="w-full h-64 object-cover rounded-t-lg"
                data-ai-hint={crop.aiHint}
              />
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center"><HeartPulse className="mr-2 text-primary" /> Requisitos Técnicos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {requirements.map(req => (
                     <li key={req.label} className="flex items-start">
                        <div className="text-primary mr-3 mt-1">{req.icon}</div>
                        <div>
                          <p className="font-semibold">{req.label}</p>
                          <p className="text-sm text-muted-foreground">{req.value}</p>
                        </div>
                      </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}