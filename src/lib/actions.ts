'use server';

import { detectPlantSpecies, type DetectPlantSpeciesOutput } from '@/ai/flows/detect-plant-species';
import { z } from 'zod';
import { getAuthenticatedUser } from '@/lib/firebase-admin';
import { addCropToUser } from '@/lib/user-service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const detectSchema = z.object({
  image: z.instanceof(File).refine(file => file.size > 0, { message: 'Se requiere una imagen.' })
    .refine(file => file.type.startsWith('image/'), { message: 'El archivo debe ser una imagen.' }),
});

export type DetectFormState = {
  error?: string;
  result?: DetectPlantSpeciesOutput;
} | undefined;


export async function detectPlantAction(prevState: DetectFormState, formData: FormData): Promise<DetectFormState> {
  const validatedFields = detectSchema.safeParse({
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.image?.[0] ?? 'Error de validación.',
    };
  }

  const file = validatedFields.data.image;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await detectPlantSpecies({ photoDataUri: dataUri });

    return { result };

  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error inesperado.';
    return {
      error: `Error al procesar la imagen: ${errorMessage}`,
    };
  }
}

export async function addCropAction(prevState: any, formData: FormData) {
  const slug = formData.get('slug') as string;
  if (!slug) {
    // This should not happen if the form is set up correctly
    throw new Error('Crop slug is missing');
  }
  
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/login');
  }

  try {
    await addCropToUser(user.uid, slug);
    revalidatePath('/dashboard');
    revalidatePath(`/cultivos/${slug}`);
  } catch (error) {
    console.error("Failed to add crop:", error);
    // You could return an error state here to be displayed on the page
  }
}
