'use server';
/**
 * @fileOverview A Genkit flow for chatting with a specialized Gemini model (Gem).
 *
 * - chatWithGem - A function that sends a prompt to the specialized Gem.
 * - ChatWithGemInput - The input type for the chatWithGem function.
 * - ChatWithGemOutput - The return type for the chatWithGem function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatWithGemInputSchema = z.object({
  prompt: z.string().describe('The user\'s question or prompt for the Gem.'),
});
export type ChatWithGemInput = z.infer<typeof ChatWithGemInputSchema>;

const ChatWithGemOutputSchema = z.object({
  response: z.string().describe('The Gem\'s response.'),
});
export type ChatWithGemOutput = z.infer<typeof ChatWithGemOutputSchema>;

export async function chatWithGem(input: ChatWithGemInput): Promise<ChatWithGemOutput> {
  return chatWithGemFlow(input);
}

const chatWithGemFlow = ai.defineFlow(
  {
    name: 'chatWithGemFlow',
    inputSchema: ChatWithGemInputSchema,
    outputSchema: ChatWithGemOutputSchema,
  },
  async (input) => {
    // IMPORTANTE: Reemplaza "gems/pl-misiones-expert" con el ID de tu Gem.
    const expertGem = ai.model("gems/pl-misiones-expert");

    const result = await ai.generate({
      model: expertGem,
      prompt: input.prompt,
    });

    const response = result.text;

    if (!response) {
      throw new Error("The AI model did not return a response.");
    }
    
    return { response };
  }
);
