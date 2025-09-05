import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookMarked } from 'lucide-react';

const glossaryTerms = [
  {
    term: 'Abono',
    definition: 'Sustancia que se añade a la tierra para hacerla más rica en nutrientes y mejorar la calidad de los cultivos. Puede ser de origen orgánico (estiércol, compost) o químico.'
  },
  {
    term: 'Aporcar',
    definition: 'Cubrir con tierra el tallo de una planta para protegerla, fortalecer su base y favorecer el desarrollo de raíces o tubérculos, como en el caso de la papa.'
  },
  {
    term: 'Compost',
    definition: 'Abono orgánico obtenido a partir de la descomposición de residuos vegetales y animales. Mejora la estructura del suelo y aporta nutrientes de forma lenta y natural.'
  },
  {
    term: 'Drenaje',
    definition: 'Capacidad del suelo o de una maceta para evacuar el exceso de agua. Un buen drenaje es crucial para evitar que las raíces se pudran.'
  },
  {
    term: 'Fertilizante',
    definition: 'Producto, generalmente químico o sintético, que se utiliza para aportar nutrientes específicos (nitrógeno, fósforo, potasio) que la planta necesita para crecer.'
  },
  {
    term: 'Fitopatología',
    definition: 'Ciencia que estudia las enfermedades de las plantas, sus causas (hongos, bacterias, virus), y los métodos para prevenirlas y controlarlas.'
  },
  {
    term: 'Germinación',
    definition: 'Proceso mediante el cual una semilla se desarrolla hasta convertirse en una nueva planta. Requiere condiciones adecuadas de humedad, temperatura y oxígeno.'
  },
  {
    term: 'Hidroponía',
    definition: 'Técnica de cultivo de plantas sin utilizar suelo, donde las raíces reciben una solución de nutrientes disueltos en agua.'
  },
  {
    term: 'pH',
    definition: 'Medida de la acidez o alcalinidad del suelo. La mayoría de las plantas prefieren un pH neutro (entre 6.0 y 7.0) para absorber correctamente los nutrientes.'
  },
  {
    term: 'Plaga',
    definition: 'Cualquier organismo (insectos, ácaros, etc.) que causa daño a los cultivos, ya sea comiendo las plantas, transmitiendo enfermedades o compitiendo por recursos.'
  },
  {
    term: 'Polinización',
    definition: 'Proceso de transferencia de polen desde los órganos masculinos a los femeninos de una flor, lo que permite la fecundación y la posterior formación de frutos y semillas.'
  },
  {
    term: 'Sustrato',
    definition: 'Medio material en el que crece una planta y le sirve de soporte, como la tierra, fibra de coco, perlita, etc. Proporciona anclaje, agua y nutrientes.'
  },
  {
    term: 'Tutorado',
    definition: 'Práctica de colocar soportes (cañas, estacas, mallas) para guiar y sostener el crecimiento de plantas trepadoras o de tallo débil, como el tomate.'
  },
];


export default function GlossaryPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
           <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                <BookMarked className="h-12 w-12 text-primary" />
            </div>
          <h1 className="text-4xl font-headline font-bold text-primary mb-2">
            Glosario de Términos Agrícolas
          </h1>
          <p className="text-lg text-muted-foreground">
            Aquí encontrarás definiciones de las palabras técnicas usadas en la plataforma.
          </p>
        </div>
        
        <Card>
            <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                    {glossaryTerms.sort((a, b) => a.term.localeCompare(b.term)).map((item) => (
                        <AccordionItem key={item.term} value={item.term}>
                            <AccordionTrigger className="text-lg font-bold hover:no-underline">{item.term}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground">
                                {item.definition}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}