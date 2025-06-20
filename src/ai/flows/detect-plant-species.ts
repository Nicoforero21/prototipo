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
    commonName: z.string().describe('The common name of the identified plant species.'),
    latinName: z.string().describe('The Latin name of the identified plant species.'),
    confidence: z.number().describe('Confidence level of the species identification (0-1).'),
  }),
  healthAssessment: z.object({
    isHealthy: z.boolean().describe('Whether or not the plant appears healthy.'),
    issues: z.string().describe('Description of any detected health issues or abnormalities.'),
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
  prompt: `You are an expert botanist specializing in identifying plant species and assessing their health based on images.

  Analyze the provided image of the plant and provide the following information:

  1.  Species Identification:
  *   Determine the common name and Latin name of the plant species.
  *   Provide a confidence level (0-1) for the species identification.

  2.  Health Assessment:
  *   Assess whether the plant appears healthy or not.
  *   Describe any detected health issues, abnormalities, or potential diseases.

  Reference the plant in the following photo: {{media url=photoDataUri}}.

  Ensure that your response is well-structured and easy to understand.`,
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
