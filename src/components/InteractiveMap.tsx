
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import type { MapEmbed } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

interface InteractiveMapProps {
    map: MapEmbed;
}

interface ParsedEmbed {
    iframeSrc: string;
    iframeTitle: string;
    scriptContent: string;
}

function parseEmbedCode(embedCode: string): ParsedEmbed | null {
    const iframeMatch = embedCode.match(/<iframe.*?src="(.*?)"[^>]*?title="(.*?)"[^>]*?>/);
    const scriptMatch = embedCode.match(/<script.*?>(.*?)<\/script>/s);

    if (iframeMatch && scriptMatch) {
        return {
            iframeSrc: iframeMatch[1],
            iframeTitle: iframeMatch[2],
            scriptContent: scriptMatch[1],
        };
    }
    return null;
}

export function InteractiveMap({ map }: InteractiveMapProps) {
    const [parsedCode, setParsedCode] = useState<ParsedEmbed | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const parsed = parseEmbedCode(map.embedCode);
        setParsedCode(parsed);
        setIsLoading(false);
    }, [map.embedCode]);
    
    useEffect(() => {
        if (parsedCode && typeof window !== 'undefined') {
            const handleMessage = (event: MessageEvent) => {
                if (event.data["datawrapper-height"]) {
                    const iframe = document.querySelector(`iframe[src="${parsedCode.iframeSrc}"]`);
                    if (iframe && iframe.contentWindow === event.source) {
                         const chartId = Object.keys(event.data["datawrapper-height"])[0];
                         const height = event.data["datawrapper-height"][chartId] + "px";
                         (iframe as HTMLIFrameElement).style.height = height;
                    }
                }
            };

            window.addEventListener("message", handleMessage);
            return () => window.removeEventListener("message", handleMessage);
        }
    }, [parsedCode]);


    if (isLoading) {
        return <Skeleton className="w-full h-[627px]" />;
    }

    if (!parsedCode) {
        return <div className="text-destructive">Error: El código del mapa es inválido.</div>;
    }

    return (
        <div className="w-full">
            <iframe
                title={parsedCode.iframeTitle}
                aria-label={map.title}
                src={parsedCode.iframeSrc}
                scrolling="no"
                frameBorder="0"
                style={{ width: '100%', border: 'none' }}
                height="627"
                data-external="1"
            />
            <Script
                id={`map-script-${map.id}`}
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: parsedCode.scriptContent }}
            />
        </div>
    );
}
