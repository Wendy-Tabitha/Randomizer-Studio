import 'dotenv/config'; // <-- Load .env variables at the top

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY, // <-- Pass API key from .env
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
