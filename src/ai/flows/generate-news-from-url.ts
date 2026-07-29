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
import dns from 'dns';
import * as http from 'http';
import * as https from 'https';

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
    inputSchema: z.object({ url: z.string().url() }),
    outputSchema: z.string(),
  },
  async ({ url }) => {
    try {
      // SECURITY: Protect against SSRF by manually following redirects and validating IPs
      let currentUrl = url;
      let response: Response;
      let redirects = 0;

      while (true) {
        if (redirects > 5) throw new Error('Too many redirects');
        const parsedUrl = new URL(currentUrl);
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') throw new Error('Only HTTP/S allowed');

        const { address, family } = await dns.promises.lookup(parsedUrl.hostname);
        const isPrivate = address === '::1' || address === '::' || /^127\.\d+\.\d+\.\d+$/.test(address) ||
          /^10\.\d+\.\d+\.\d+$/.test(address) || /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(address) ||
          /^192\.168\.\d+\.\d+$/.test(address) || /^0\.0\.0\.0$/.test(address) || /^169\.254\.\d+\.\d+$/.test(address) ||
          /^f[cd][0-9a-f]{2}:/i.test(address) || /^::ffff:(127|10|172\.(1[6-9]|2\d|3[0-1])|192\.168|169\.254|0)\./i.test(address);

        if (isPrivate) throw new Error('Access to private network forbidden');

        response = await new Promise<Response>((resolve, reject) => {
          const protocol = parsedUrl.protocol === 'https:' ? https : http;
          const req = protocol.request({
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'GET',
            lookup: (hostname, opts, callback) => {
              // Override DNS lookup to enforce the validated IP
              callback(null, address, family);
            }
          }, (res) => {
            const status = res.statusCode || 200;
            const headers = new Headers();
            for (const [key, value] of Object.entries(res.headers)) {
              if (Array.isArray(value)) {
                value.forEach(v => headers.append(key, v));
              } else if (value !== undefined) {
                headers.append(key, value);
              }
            }
            const isRedirect = [301, 302, 303, 307, 308].includes(status);

            if (isRedirect) {
              resolve(new Response(null, { status, headers }));
              return;
            }

            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              resolve(new Response(data, { status, headers }));
            });
          });

          req.on('error', reject);
          req.end();
        });

        if ([301, 302, 303, 307, 308].includes(response.status)) {
          const location = response.headers.get('location');
          if (!location) throw new Error('Redirect missing location header');
          currentUrl = new URL(location, currentUrl).toString();
          redirects++;
        } else {
          break;
        }
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
    const result = await newsGenerationPrompt(input);
    const output = result.output;
    if (!output) {
        throw new Error("The AI model did not return the expected output.");
    }
    return output;
  }
);
