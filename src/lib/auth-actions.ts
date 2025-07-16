'use server';

import { z } from 'zod';
import { getUserByEmail, createUser } from './user-service';

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
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return {
        message: 'Ya existe una cuenta con este correo electrónico.',
        error: true,
        success: false,
      };
    }

    // In a real app, hash the password here before saving
    await createUser({ name, email, password, region });
    
    return { message: '¡Usuario registrado con éxito!', success: true, error: false };
  } catch (error) {
    console.error('Registration error:', error);
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
    const user = await getUserByEmail(email);

    if (!user) {
      return {
        message: 'No existe una cuenta con ese correo electrónico.',
        error: true,
        success: false,
      };
    }
    
    // NOTE: In a real app, you would use a secure password comparison function
    // like bcrypt.compare() instead of this plain text comparison.
    if (user.password !== password) {
       return {
        message: 'La contraseña es incorrecta.',
        error: true,
        success: false,
      };
    }

    // Here you would typically create a session, set a cookie, etc.
    // For this example, we'll just return a success message.
    return { message: 'Inicio de sesión exitoso.', success: true, error: false };

  } catch (error) {
    console.error('Login error:', error);
    return {
      message: 'Ocurrió un error en el servidor. Por favor, inténtelo de nuevo.',
      error: true,
      success: false,
    };
  }
}
