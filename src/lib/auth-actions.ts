
'use server';

import { z } from 'zod';
import {
  createAdminAuthUser,
  setCookie,
} from './firebase-admin';
import { createUser as createFirestoreUser } from './user-service';
import { cookies } from 'next/headers';

export type AuthState = {
  message: string;
  error: boolean;
  success: boolean;
};

const regions = [
  "Andina",
  "Caribe",
  "Pacífica",
  "Orinoquía",
  "Amazonía",
  "Insular"
];

const registerSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor ingrese un correo electrónico válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
  region: z.enum(regions, {
    errorMap: () => ({ message: "Por favor seleccione una región válida." }),
  }),
});

export async function registerUserAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errorMessages).flat().shift();
    return {
      message: firstError || 'Error de validación. Por favor, revise los campos.',
      error: true,
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
    
    return { message: '¡Usuario registrado con éxito!', success: true, error: false };
  } catch (error: any) {
    console.error('Registration error:', error.code, error.message);
     if (error.code === 'auth/email-already-exists') {
      return {
        message: 'Ya existe una cuenta con este correo electrónico.',
        error: true,
        success: false,
      };
    }
    return {
      message: 'Ocurrió un error en el servidor. Por favor, inténtelo de nuevo.',
      error: true,
      success: false,
    };
  }
}

export async function logoutAction() {
    // Clear the auth cookie
    cookies().delete('session');
    // It's important to also sign out from the client-side Firebase instance
    // to clear its token cache. This should be handled on the client.
}
