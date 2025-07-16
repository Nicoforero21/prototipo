'use client';

import { useFormState } from 'react-dom';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf } from 'lucide-react'
import Link from "next/link"
import { loginUserAction } from '@/lib/auth-actions';
import { SubmitButton } from '@/components/submit-button';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const initialState = {
  message: '',
  error: false,
  success: false,
};

export default function LoginPage() {
  const [state, formAction] = useFormState(loginUserAction, initialState);
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    if(state.error) {
       toast({
        variant: 'destructive',
        title: 'Error de inicio de sesión',
        description: state.message,
      });
    }
    if (state.success) {
      toast({
        title: '¡Bienvenido de vuelta!',
        description: 'Has iniciado sesión correctamente.',
      });
      router.push('/dashboard');
    }
  }, [state, toast, router]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Leaf className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="font-headline text-2xl mt-4">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa a tu panel para seguir tus cultivos.</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" name="password" type="password" placeholder="Tu contraseña" required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton className="w-full" pendingText="Ingresando...">Ingresar</SubmitButton>
            <p className="text-center text-sm text-muted-foreground">
              ¿No tienes una cuenta? <Link href="/register" className="underline text-primary">Regístrate</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
