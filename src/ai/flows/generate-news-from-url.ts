'use server';
/**
 * @fileOverview Generates news content from a given URL by fetching, parsing, and summarizing its content.
 *
 * - generateNewsContent - A function that handles the generation of news content from a URL.
 * - GenerateNewsContentInput - The input type for the generateNewsContent function.
 * - GenerateNewsContentOutput - The return type for the generateNewsContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as cheerio from 'cheerio';

const GenerateNewsContentInputSchema = z.object({
  url: z.string().url().describe('The URL to generate news content from.'),
});
export type GenerateNewsContentInput = z.infer<typeof GenerateNewsContentInputSchema>;

const GenerateNewsContentOutputSchema = z.object({
  title: z.string().describe('The concise, engaging title of the news article.'),
  content: z.string().describe('The main content of the news article, written in clear and neutral Spanish.'),
});
export type GenerateNewsContentOutput = z.infer<typeof GenerateNewsContentOutputSchema>;

export async function generateNewsContent(input: GenerateNewsContentInput): Promise<GenerateNewsContentOutput> {
  return generateNewsContentFlow(input);
}

const fetchAndParseUrlTool = ai.defineTool(
  {
    name: 'fetchAndParseUrl',
    description: 'Fetches the content of a URL and returns the clean, plain text of the main body.',
    input: { schema: z.object({ url: z.string().url() }) },
    output: { schema: z.string() },
  },
  async ({ url }) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      const $ = cheerio.load(html);

      // Remove script and style elements
      $('script, style, noscript, iframe, header, footer, nav, aside').remove();

      // Get text from the body, trying to find the main content area
      let mainText = $('article').text() || $('main').text() || $('body').text();
      
      // Basic cleanup
      mainText = mainText.replace(/\s\s+/g, ' ').replace(/\n/g, ' ').trim();

      // Return a substring to avoid exceeding context length limits
      return mainText.substring(0, 15000); 

    } catch (e) {
      console.error('Error fetching or parsing URL:', e);
      return `Failed to fetch or parse URL: ${(e as Error).message}`;
    }
  }
);

const newsGenerationPrompt = ai.definePrompt({
    name: 'newsGenerationPrompt',
    input: { schema: z.object({ url: z.string().url() }) },
    output: { schema: GenerateNewsContentOutputSchema },
    tools: [fetchAndParseUrlTool],
    prompt: `Based on the content from the provided URL, please generate a news article in Spanish.
    
    Instructions:
    1. Use the 'fetchAndParseUrl' tool to get the text content from the URL: {{{url}}}.
    2. From the extracted text, write a clear and concise news article.
    3. Create a compelling and relevant title for the article.
    4. The content should be objective and well-written.`,
});


const generateNewsContentFlow = ai.defineFlow(
  {
    name: 'generateNewsContentFlow',
    inputSchema: GenerateNewsContentInputSchema,
    outputSchema: GenerateNewsContentOutputSchema,
  },
  async (input) => {
    const { output } = await newsGenerationPrompt(input);
    if (!output) {
        throw new Error("The AI model did not return the expected output.");
    }
    return output;
  }
);
