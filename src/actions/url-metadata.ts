'use server';

import type { LinkPreviewMetadata } from '@/lib/types';
import * as cheerio from 'cheerio';

export async function fetchUrlMetadataAction(url: string): Promise<{ success: boolean; metadata?: LinkPreviewMetadata; message: string }> {
  try {
    if (!url) {
      return { success: false, message: 'URL vacía.' };
    }

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    // Try parsing the URL to check if it's valid
    new URL(targetUrl);

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_aged_3.0.html)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
      next: { revalidate: 3600 } // Cache results for 1 hour
    });

    if (!response.ok) {
      return { success: false, message: `Error al acceder al sitio: ${response.statusText}` };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract Open Graph tags
    const ogTitle = $('meta[property="og:title"]').attr('content') || 
                    $('meta[name="twitter:title"]').attr('content') || 
                    $('title').text();
                    
    const ogDescription = $('meta[property="og:description"]').attr('content') || 
                          $('meta[name="twitter:description"]').attr('content') || 
                          $('meta[name="description"]').attr('content');
                          
    const ogImage = $('meta[property="og:image"]').attr('content') || 
                    $('meta[name="twitter:image"]').attr('content');
                    
    const ogSiteName = $('meta[property="og:site_name"]').attr('content') || 
                       new URL(targetUrl).hostname;

    return {
      success: true,
      metadata: {
        url: targetUrl,
        title: ogTitle ? ogTitle.trim() : undefined,
        description: ogDescription ? ogDescription.trim() : undefined,
        imageUrl: ogImage ? ogImage.trim() : undefined,
        siteName: ogSiteName ? ogSiteName.trim() : undefined,
      },
      message: 'Metadatos cargados con éxito.'
    };
  } catch (error) {
    console.error('Error in fetchUrlMetadataAction:', error);
    return { success: false, message: `Error al obtener metadatos: ${error instanceof Error ? error.message : 'Error desconocido'}` };
  }
}
