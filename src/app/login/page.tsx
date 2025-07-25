'use client';

import { useState, type FormEvent } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Loader2 } from 'lucide-react';
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { app } from '@/lib/firebase'; // Import the initialized client app

const auth = getAuth(app);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // The session cookie will be set by Firebase's persistence layer
      // and on subsequent server-side requests, getAuthenticatedUser will work.
      // We just need to trigger a server-side navigation.
      
      toast({
        title: '¡Bienvenido de vuelta!',
        description: 'Has iniciado sesión correctamente.',
      });
      router.push('/dashboard');
      router.refresh(); // Force a refresh to update server components like the header
      
    } catch (error: any) {
      console.error('Login error:', error.code, error.message);
      let description = 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        description = 'El correo electrónico o la contraseña son incorrectos.';
      }
      
      toast({
        variant: 'destructive',
        title: 'Error de inicio de sesión',
        description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Leaf className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="font-headline text-2xl mt-4">Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa a tu panel para seguir tus cultivos.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="tu@email.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="Tu contraseña" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              ¿No tienes una cuenta? <Link href="/register" className="underline text-primary">Regístrate</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
