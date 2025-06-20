import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BookOpen, Map, Wind } from 'lucide-react';

const resources = [
  {
    title: 'Guía para Docentes: Mi Primera Huerta Escolar',
    description: 'Un manual completo para iniciar un proyecto de huerta en instituciones educativas de primaria y secundaria.',
    icon: <BookOpen className="h-12 w-12 text-primary" />,
    file: '/Guia_Huerta_Escolar_Completa.pdf',
  },
  {
    title: 'Proyecto de Aula: Cultivos por Temporada',
    description: 'Actividades y proyectos gamificados para enseñar sobre los ciclos de siembra y cosecha según la temporada.',
    icon: <Wind className="h-12 w-12 text-primary" />,
    file: '/proyecto-cultivos-temporada.pdf',
  },
  {
    title: 'Mapa de Cultivos para Colorear',
    description: 'Recurso didáctico para que los más pequeños aprendan sobre la diversidad agrícola de las regiones de Colombia.',
    icon: <Map className="h-12 w-12 text-primary" />,
    file: '/mapa-cultivos-colorear.pdf',
  },
];

export default function RecursosPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">
          Guías Pedagógicas y Recursos Educativos
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Material descargable para docentes de primaria y secundaria, diseñado para fomentar la conciencia ambiental y la soberanía alimentaria.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((resource, index) => (
          <Card key={index} className="flex flex-col text-center items-center hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="items-center">
              <div className="bg-primary/10 p-4 rounded-full">
                {resource.icon}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardTitle className="font-headline text-xl mb-2">{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href={resource.file} download>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar PDF
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
