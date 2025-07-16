export type Crop = {
  name: string;
  slug: string;
  latinName: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  aiHint: string;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  lifecycle: string[];
  requirements: {
    watering: string;
    climate: string;
    space: string;
    pests: string;
    fertilizers: string;
  };
  sowingGuide: {
    pot: string;
    soil: string;
    hydroponics: string;
  };
};

export type User = {
  id: string; // This will be the Firebase Auth UID
  name: string;
  email: string;
  region: string;
  password?: string; // Password should not be sent to the client
  trackedCrops: string[]; // Array of crop slugs
};

    