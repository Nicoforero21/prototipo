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
import { registerUserAction } from '@/lib/auth-actions';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor ingrese un correo electrónico válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
  region: z.string({
    required_error: "Por favor seleccione una región.",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>

const regions = [
  "Andina",
  "Caribe",
  "Pacífica",
  "Orinoquía",
  "Amazonía",
  "Insular"
];

const initialState = {
  message: '',
  error: false,
  success: false,
};

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUserAction, initialState);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      region: undefined
    },
  });

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error de Registro',
        description: state.message,
      });
    }
    if (state?.success) {
      toast({
        title: '¡Registro Exitoso!',
        description: 'Ahora puedes iniciar sesión con tu nueva cuenta.',
      });
      router.push('/login');
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
        <Form {...form}>
          <form action={formAction}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" name="name" type="text" placeholder="Tu nombre completo" required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input id="password" name="password" type="password" placeholder="Crea una contraseña" required />
                </div>
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Región</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} name="region">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu región" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>{region}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <SubmitButton className="w-full" pendingText="Creando cuenta...">
                Crear Cuenta
              </SubmitButton>
              <p className="text-center text-sm text-muted-foreground">
                ¿Ya tienes una cuenta? <Link href="/login" className="underline text-primary">Inicia Sesión</Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
