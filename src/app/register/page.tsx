'use client';

import { useActionState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf } from 'lucide-react';
import Link from 'next/link';
import { registerUserAction, type AuthState } from '@/lib/auth-actions';
import { SubmitButton } from '@/components/submit-button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const regions = [
  "Andina",
  "Caribe",
  "Pacífica",
  "Orinoquía",
  "Amazonía",
  "Insular"
];

const initialState: AuthState = {
  message: '',
  errors: {},
  success: false,
};

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUserAction, initialState);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast({
        title: '¡Registro Exitoso!',
        description: 'Ahora puedes iniciar sesión con tu nueva cuenta.',
      });
      router.push('/login');
    } else if (state.message && !state.errors) {
       toast({
        variant: 'destructive',
        title: 'Error de Registro',
        description: state.message,
      });
    }
  }, [state, toast, router]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Leaf className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="font-headline text-2xl mt-4">Crear Cuenta</CardTitle>
          <CardDescription>Regístrate para empezar a cultivar.</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" name="name" type="text" placeholder="Tu nombre completo" required />
                {state.errors?.name && <p className="text-destructive text-sm">{state.errors.name[0]}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
                 {state.errors?.email && <p className="text-destructive text-sm">{state.errors.email[0]}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" name="password" type="password" placeholder="Crea una contraseña (mín. 6 caracteres)" required />
                 {state.errors?.password && <p className="text-destructive text-sm">{state.errors.password[0]}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label>Región</Label>
                <Select name="region" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu región" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 {state.errors?.region && <p className="text-destructive text-sm">{state.errors.region[0]}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton className="w-full" pendingText="Creando cuenta...">
              Crear Cuenta
            </SubmitButton>
             {state.message && !state.success && !state.errors && (
              <p className="text-destructive text-sm text-center">{state.message}</p>
            )}
            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes una cuenta? <Link href="/login" className="underline text-primary">Inicia Sesión</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
