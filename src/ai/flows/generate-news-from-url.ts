'use server';
/**
 * @fileOverview Generates news content from various inputs (URL, text, or ideas) using Genkit and Gemini.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as cheerio from 'cheerio';

const GenerateNewsContentInputSchema = z.object({
  mode: z.enum(['url', 'text', 'idea']).describe('El modo de generación de contenido.'),
  url: z.string().url().optional().describe('La URL para extraer contenido (modo url).'),
  text: z.string().optional().describe('El texto de origen para reescribir (modo text).'),
  prompt: z.string().optional().describe('La idea o directrices para generar el artículo (modo idea).'),
  tone: z.string().optional().describe('El tono de redacción deseado.'),
  length: z.enum(['short', 'medium', 'long']).optional().describe('Largo del artículo.'),
  includeSubheadings: z.boolean().optional().describe('Si debe incluir subtítulos H2.'),
  instructions: z.string().optional().describe('Instrucciones adicionales para la IA.'),
});
export type GenerateNewsContentInput = z.infer<typeof GenerateNewsContentInputSchema>;

const GenerateNewsContentOutputSchema = z.object({
  titles: z.array(z.string()).describe('Lista de 3 a 5 títulos sugeridos para la noticia.'),
  content: z.string().describe('El cuerpo principal de la noticia, redactado en español formal y limpio, formateado en HTML (usando <p>, <h2>, <strong>, <ul>, <li>).'),
  imageHint: z.string().describe('Sugerencia de 1 a 2 palabras para buscar una imagen en la galería (ej: "evento politico").'),
  seoDescription: z.string().describe('Una descripción resumida de la noticia para SEO (de 120 a 155 caracteres).'),
});
export type GenerateNewsContentOutput = z.infer<typeof GenerateNewsContentOutputSchema>;

// Helper function to fetch and clean URL content
export async function fetchAndParseUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, { 
      redirect: 'follow',
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_aged_3.0.html)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script, style, header, footer, navigation, etc.
    $('script, style, noscript, iframe, header, footer, nav, aside, svg, form, button, head, metadata').remove();

    // Get text from the body, trying to find the main content area using progressive selectors
    let mainText = '';
    const selectors = [
      'article',
      '[itemprop="articleBody"]',
      '.post-content',
      '.entry-content',
      '.article-content',
      'main',
      '#main',
      '.main',
      'body'
    ];
    
    for (const selector of selectors) {
      const text = $(selector).text().trim();
      if (text && text.length > 200) {
        mainText = text;
        break;
      }
    }

    if (!mainText) {
      mainText = $('body').text();
    }
    
    // Basic cleanup
    mainText = mainText.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();

    return mainText.substring(0, 15000); 

  } catch (e) {
    console.error('Error fetching or parsing URL:', e);
    throw new Error(`No se pudo obtener o leer el contenido de la URL: ${(e as Error).message}`);
  }
}

export async function generateNewsContent(input: GenerateNewsContentInput): Promise<GenerateNewsContentOutput> {
  return generateNewsContentFlow(input);
}

const generateNewsContentFlow = ai.defineFlow(
  {
    name: 'generateNewsContentFlow',
    inputSchema: GenerateNewsContentInputSchema,
    outputSchema: GenerateNewsContentOutputSchema,
  },
  async (input) => {
    let sourceContent = '';

    if (input.mode === 'url') {
      if (!input.url) {
        throw new Error('La URL es requerida para el modo de generación por URL.');
      }
      sourceContent = await fetchAndParseUrl(input.url);
    } else if (input.mode === 'text') {
      if (!input.text) {
        throw new Error('El texto es requerido para el modo de generación por texto.');
      }
      sourceContent = input.text;
    } else if (input.mode === 'idea') {
      if (!input.prompt) {
        throw new Error('La idea/prompt es requerida para el modo de generación por idea.');
      }
      sourceContent = input.prompt;
    }

    const toneStr = input.tone || 'Informativo';
    const lengthStr = input.length === 'short' 
      ? 'Breve (~200 palabras, resumen ejecutivo directo)' 
      : input.length === 'long' 
      ? 'Extenso (~600 palabras, cobertura detallada y estructurada)' 
      : 'Mediano (~400 palabras, artículo estándar)';
    
    const structureStr = input.includeSubheadings 
      ? 'Debe incluir subtítulos profesionales utilizando etiquetas <h2> para dividir las secciones temáticas.' 
      : 'Escribir párrafos continuos sin incluir subtítulos intermedios.';

    const promptText = `
Eres un periodista profesional y redactor oficial del "Partido Libertario de Misiones" (PL Misiones). Tu tarea es redactar una noticia en español formal, objetiva pero atractiva, adaptada para el sitio web del partido.

Modo de Generación: ${input.mode.toUpperCase()}
Tono de voz: ${toneStr}
Largo del artículo: ${lengthStr}
Estructura de subtítulos: ${structureStr}
${input.instructions ? `Instrucciones adicionales a seguir estrictamente: ${input.instructions}` : ''}

Información / Contenido de Origen:
"""
${sourceContent}
"""

Requisitos de Salida (Formato JSON estructurado):
1. 'titles': Un arreglo con entre 3 y 5 títulos alternativos sugeridos para la noticia, ordenados por relevancia. Deben ser llamativos, claros y profesionales.
2. 'content': El cuerpo principal del artículo. Debe estar formateado EXCLUSIVAMENTE con etiquetas HTML válidas y limpias como <p>, <h2>, <strong>, <em>, <ul>, <li>. No uses etiquetas Markdown, no uses etiquetas HTML complejas ni clases CSS. Asegura una excelente gramática y ortografía en español.
3. 'imageHint': Una pista de búsqueda en la galería de imágenes (1 a 2 palabras clave descriptivas del tema en español, ej: "reunion militantes", "conferencia prensa", "voto electoral").
4. 'seoDescription': Un resumen atractivo de la noticia de entre 120 y 155 caracteres, adecuado para motores de búsqueda o redes sociales.
`;

    const response = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: promptText,
      output: {
        schema: GenerateNewsContentOutputSchema,
      }
    });

    const output = response.output;
    if (!output) {
      throw new Error("El modelo de IA no devolvió el formato esperado.");
    }

    return output;
  }
);
