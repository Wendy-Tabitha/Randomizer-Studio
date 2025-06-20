'use server';

/**
 * @fileOverview AI agent that generates a creative writing prompt.
 *
 * - generateWritingPrompt - A function that generates the creative writing prompt.
 * - GenerateWritingPromptInput - The input type for the generateWritingPrompt function.
 * - GenerateWritingPromptOutput - The return type for the generateWritingPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWritingPromptInputSchema = z.object({
  genre: z
    .string()
    .optional()
    .describe('The genre of the story the user wants to write.'),
  keywords: z
    .string()
    .optional()
    .describe('Keywords to include in the writing prompt.'),
});
export type GenerateWritingPromptInput = z.infer<
  typeof GenerateWritingPromptInputSchema
>;

const GenerateWritingPromptOutputSchema = z.object({
  prompt: z.string().describe('A creative writing prompt.'),
});
export type GenerateWritingPromptOutput = z.infer<
  typeof GenerateWritingPromptOutputSchema
>;

export async function generateWritingPrompt(
  input: GenerateWritingPromptInput
): Promise<GenerateWritingPromptOutput> {
  return generateWritingPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'writingPromptPrompt',
  input: {schema: GenerateWritingPromptInputSchema},
  output: {schema: GenerateWritingPromptOutputSchema},
  prompt: `You are a creative writing prompt generator. Generate a creative writing prompt based on the following information.

Genre: {{{genre}}}
Keywords: {{{keywords}}}

Do not include the words genre or keywords in the prompt.`,
});

const generateWritingPromptFlow = ai.defineFlow(
  {
    name: 'generateWritingPromptFlow',
    inputSchema: GenerateWritingPromptInputSchema,
    outputSchema: GenerateWritingPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
