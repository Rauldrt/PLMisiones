'use server';

import type { StreamingItem } from '@/lib/types';
import { getStreamingAction } from './data';

const DEFAULT_CHANNEL_ID = 'UCdGTYNVAtaYn1NK-MLRYOkw'; // @AGORALIBERTARIA

export async function getYouTubeChannelVideosAction(channelId: string = DEFAULT_CHANNEL_ID): Promise<StreamingItem[]> {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 1800 }, // Revalidate every 30 minutes
    });

    if (!response.ok) {
      console.warn(`[YouTube RSS] HTTP error: ${response.status}. Falling back to stored streaming items.`);
      return await getStreamingAction();
    }

    const xml = await response.text();
    const entries = xml.split('<entry>');
    
    if (entries.length <= 1) {
      return await getStreamingAction();
    }

    const items: StreamingItem[] = [];

    for (let i = 1; i < entries.length; i++) {
      const entry = entries[i];
      const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);

      if (videoIdMatch && videoIdMatch[1]) {
        const videoId = videoIdMatch[1].trim();
        const rawTitle = titleMatch ? titleMatch[1].trim() : 'Video de Ágora Libertaria';
        // Clean XML entities in title if any
        const title = rawTitle
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");

        const publishedAt = publishedMatch ? publishedMatch[1].trim() : undefined;
        const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        const embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;

        items.push({
          id: videoId,
          videoId,
          title,
          publishedAt,
          thumbnailUrl,
          embedCode,
        });
      }
    }

    if (items.length === 0) {
      return await getStreamingAction();
    }

    return items;
  } catch (error) {
    console.error('[YouTube RSS] Error fetching channel videos:', error);
    return await getStreamingAction();
  }
}
