'use server';

import {genkit} from 'genkit';
import {googleAI} from 'genkit/googleai';

// Initialize Genkit and export the 'ai' object
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  logSinks: [],
  enableTracing: process.env.NODE_ENV === "development",
});
