
'use server';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sprout, Wheat } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">
          Mi Panel de Cultivo
        </h1>
        <p className="text-lg text-muted-foreground">
          Esta funcionalidad se encuentra deshabilitada temporalmente.
        </p>
      </div>

      <Card className="col-span-1 md:col-span-2 lg:col-span-3 text-center p-12">
          <CardHeader>
              <Wheat className="h-16 w-16 mx-auto text-muted-foreground" />
              <CardTitle className="font-headline mt-4">Página en Mantenimiento</CardTitle>
              <CardDescription className="mt-2">
                  Estamos trabajando en esta sección. Mientras tanto, puedes seguir explorando los cultivos disponibles.
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
    </div>
  );
}
