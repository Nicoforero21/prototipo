
'use server';

import { z } from 'zod';
import {
  createAdminAuthUser,
} from './firebase-admin';
import { createUser as createFirestoreUser } from './user-service';
import { cookies } from 'next/headers';

const regions = [
  "Andina", "Caribe", "Pacífica", "Orinoquía", "Amazonía", "Insular"
] as const;

const registerSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor ingrese un correo electrónico válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
  region: z.enum(regions, {
    errorMap: () => ({ message: "Por favor seleccione una región válida." }),
  }),
});

export type AuthState = {
  message: string;
  errors?: z.ZodError<z.infer<typeof registerSchema>>['formErrors']['fieldErrors'];
  success: boolean;
};

export async function registerUserAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: 'Error de validación. Por favor, revise los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { name, email, password, region } = validatedFields.data;

  try {
    const userRecord = await createAdminAuthUser({
      email,
      password,
      displayName: name,
    });
    
    await createFirestoreUser(userRecord.uid, {
      name,
      email,
      region,
      trackedCrops: []
    });
    
    return { message: '¡Usuario registrado con éxito!', success: true };
  } catch (error: any) {
    console.error('Registration error:', error);
     if (error.code === 'auth/email-already-exists') {
      return {
        message: 'Ya existe una cuenta con este correo electrónico.',
        success: false,
      };
    }
    return {
      message: 'ocurrió un error en el servidor',
      success: false,
    };
  }
}

export async function logoutAction() {
    // Clear the auth cookie
    cookies().delete('session');
}
