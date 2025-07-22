
'use server';

import { config } from 'dotenv';
config({ path: '.env' });

import { z } from 'zod';
import {
  setCookie,
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from './firebase-admin';
import { createUser as createFirestoreUser } from './user-service';

export type AuthState = {
  message: string;
  error: boolean;
  success: boolean;
};

const registerSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor ingrese un correo electrónico válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
  region: z.string({
    required_error: "Por favor seleccione una región.",
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
    return {
      message: Object.values(errorMessages).flat().join(' '),
      error: true,
      success: false,
    };
  }

  const { name, email, password, region } = validatedFields.data;

  try {
    const { localId } = await signUpWithEmail({
      email,
      password,
      displayName: name,
    });
    
    await createFirestoreUser({
      id: localId,
      name,
      email,
      region,
      trackedCrops: []
    });
    
    return { message: '¡Usuario registrado con éxito!', success: true, error: false };
  } catch (error: any) {
    console.error('Registration error:', error.code, error.message);
     if (error.code === 'auth/email-already-exists' || error.message.includes('EMAIL_EXISTS')) {
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


const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor ingrese un correo electrónico válido.' }),
  password: z.string().min(1, { message: 'La contraseña no puede estar vacía.' }),
});

export async function loginUserAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
     return {
      message: Object.values(errorMessages).flat().join(' '),
      error: true,
      success: false,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const { idToken } = await signInWithEmail(email, password);
    await setCookie(idToken);
    
    return { message: 'Inicio de sesión exitoso.', success: true, error: false };
  } catch (error: any) {
    console.error('Login error:', error.code, error.message);
    let message = 'Ocurrió un error en el servidor. Por favor, inténtelo de nuevo.';

    if (error.code === 'auth/invalid-credential' || error.message.includes('INVALID_LOGIN_CREDENTIALS')) {
        message = 'Correo electrónico o contraseña incorrectos.';
    }

    return {
      message,
      error: true,
      success: false,
    };
  }
}

export async function logoutAction() {
    await setCookie(null);
}
