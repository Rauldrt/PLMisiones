'use client';

import { useEffect, useState, useRef } from 'react';
import type { MapEmbed } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

interface InteractiveMapProps {
    map: MapEmbed;
}

interface ParsedEmbed {
    iframeSrc: string;
    iframeTitle: string;
}

function parseEmbedCode(embedCode: string): ParsedEmbed | null {
    const srcMatch = embedCode.match(/<iframe.*?src="(.*?)"/);
    const titleMatch = embedCode.match(/<iframe.*?title="(.*?)"/);

    if (srcMatch && srcMatch[1] && titleMatch && titleMatch[1]) {
        return {
            iframeSrc: srcMatch[1],
            iframeTitle: titleMatch[1],
        };
    }
    return null;
}


export function InteractiveMap({ map }: InteractiveMapProps) {
    const [parsedCode, setParsedCode] = useState<ParsedEmbed | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const parsed = parseEmbedCode(map.embedCode);
        setParsedCode(parsed);
        setIsLoading(false);
    }, [map.embedCode]);
    
    useEffect(() => {
        if (parsedCode && typeof window !== 'undefined') {
            const handleMessage = (event: MessageEvent) => {
                if (event.data["datawrapper-height"]) {
                    const iframe = iframeRef.current;
                    if (iframe && iframe.contentWindow === event.source) {
                         const chartId = Object.keys(event.data["datawrapper-height"])[0];
                         const height = event.data["datawrapper-height"][chartId] + "px";
                         iframe.style.height = height;
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
                ref={iframeRef}
                title={parsedCode.iframeTitle}
                aria-label={map.title}
                src={parsedCode.iframeSrc}
                scrolling="no"
                frameBorder="0"
                style={{ width: '100%', border: 'none' }}
                height="627"
                data-external="1"
            />
        </div>
    );
}
