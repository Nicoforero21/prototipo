'use server';

/**
 * @fileOverview AI flow to detect plant species and assess its health from an image.
 *
 * - detectPlantSpecies - A function that handles the plant species detection and health assessment process.
 * - DetectPlantSpeciesInput - The input type for the detectPlantSpecies function.
 * - DetectPlantSpeciesOutput - The return type for the detectPlantSpecies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectPlantSpeciesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectPlantSpeciesInput = z.infer<typeof DetectPlantSpeciesInputSchema>;

const DetectPlantSpeciesOutputSchema = z.object({
  speciesIdentification: z.object({
    commonName: z.string().describe('El nombre común en español de la especie de planta identificada.'),
    latinName: z.string().describe('El nombre en latín de la especie de planta identificada.'),
    confidence: z.number().describe('Nivel de confianza de la identificación de la especie (0-1).'),
  }),
  healthAssessment: z.object({
    isHealthy: z.boolean().describe('Si la planta parece estar sana o no.'),
    issues: z.string().describe('Descripción en español de cualquier problema de salud, anormalidad o posible enfermedad detectada.'),
  }),
  careRecommendations: z.object({
    watering: z.string().describe('Instrucciones de riego en español.'),
    sunlight: z.string().describe('Recomendaciones de luz solar en español.'),
    generalTips: z.string().describe('Consejos generales de cuidado en español para mantener la planta sana o ayudar a su recuperación.'),
  }),
});
export type DetectPlantSpeciesOutput = z.infer<typeof DetectPlantSpeciesOutputSchema>;

export async function detectPlantSpecies(input: DetectPlantSpeciesInput): Promise<DetectPlantSpeciesOutput> {
  return detectPlantSpeciesFlow(input);
}

const detectPlantSpeciesPrompt = ai.definePrompt({
  name: 'detectPlantSpeciesPrompt',
  input: {schema: DetectPlantSpeciesInputSchema},
  output: {schema: DetectPlantSpeciesOutputSchema},
  prompt: `Eres un botánico experto y un agrónomo especializado en identificar especies de plantas y cuidarlas, a partir de imágenes. Todas tus respuestas deben ser en español.

  Analiza la imagen de la planta proporcionada y brinda la siguiente información:

  1.  Identificación de la Especie:
  *   Determina el nombre común en español y el nombre en latín de la especie de la planta.
  *   Proporciona un nivel de confianza (0-1) para la identificación de la especie.

  2.  Evaluación de Salud:
  *   Evalúa si la planta parece estar sana o no.
  *   Describe cualquier problema de salud, anormalidad o posible enfermedad detectada.

  3.  Recomendaciones de Cuidado:
  *   Proporciona instrucciones claras y concisas sobre el riego (watering).
  *   Da recomendaciones sobre la cantidad y tipo de luz solar que necesita (sunlight).
  *   Ofrece consejos generales adicionales (generalTips) para mantener la planta saludable o para tratar los problemas detectados.

  Haz referencia a la planta en la siguiente foto: {{media url=photoDataUri}}.

  Asegúrate de que tu respuesta esté bien estructurada y sea fácil de entender para un jardinero aficionado.`,
});

const detectPlantSpeciesFlow = ai.defineFlow(
  {
    name: 'detectPlantSpeciesFlow',
    inputSchema: DetectPlantSpeciesInputSchema,
    outputSchema: DetectPlantSpeciesOutputSchema,
  },
  async input => {
    const {output} = await detectPlantSpeciesPrompt(input);
    return output!;
  }
);
