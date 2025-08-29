'use server';
/**
 * @fileOverview Generates news content from a given URL.
 *
 * - generateNewsContent - A function that handles the generation of news content from a URL.
 * - GenerateNewsContentInput - The input type for the generateNewsContent function.
 * - GenerateNewsContentOutput - The return type for the generateNewsContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNewsContentInputSchema = z.object({
  url: z.string().url().describe('The URL to generate news content from.'),
});
export type GenerateNewsContentInput = z.infer<typeof GenerateNewsContentInputSchema>;

const GenerateNewsContentOutputSchema = z.object({
  title: z.string().describe('The title of the news article.'),
  content: z.string().describe('The main content of the news article.'),
});
export type GenerateNewsContentOutput = z.infer<typeof GenerateNewsContentOutputSchema>;

export async function generateNewsContent(input: GenerateNewsContentInput): Promise<GenerateNewsContentOutput> {
  return generateNewsContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNewsContentPrompt',
  input: {schema: GenerateNewsContentInputSchema},
  output: {schema: GenerateNewsContentOutputSchema},
  prompt: `You are an expert news content generator.  Given a URL, you will extract the relevant content and generate a news article.

URL: {{{url}}}

Title:
Content:`, // initial
});

const generateNewsContentFlow = ai.defineFlow(
  {
    name: 'generateNewsContentFlow',
    inputSchema: GenerateNewsContentInputSchema,
    outputSchema: GenerateNewsContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
