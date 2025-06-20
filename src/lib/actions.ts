'use server';

import { detectPlantSpecies, type DetectPlantSpeciesOutput } from '@/ai/flows/detect-plant-species';
import { z } from 'zod';

const detectSchema = z.object({
  image: z.instanceof(File).refine(file => file.size > 0, { message: 'Se requiere una imagen.' })
    .refine(file => file.type.startsWith('image/'), { message: 'El archivo debe ser una imagen.' }),
});

export type FormState = {
  error?: string;
  result?: DetectPlantSpeciesOutput;
} | undefined;


export async function detectPlantAction(prevState: FormState, formData: FormData): Promise<FormState> {
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
