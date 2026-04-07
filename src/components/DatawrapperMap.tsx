'use client';
import { useEffect, useRef } from 'react';

interface DatawrapperMapProps {
    title: string;
    src: string;
}

export function DatawrapperMap({ title, src }: DatawrapperMapProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleMessage = (event: MessageEvent) => {
                if (
                    event.data &&
                    typeof event.data === 'object' &&
                    "datawrapper-height" in event.data
                ) {
                    const iframe = iframeRef.current;
                    if (iframe && iframe.contentWindow === event.source) {
                         const chartId = Object.keys(event.data["datawrapper-height"])[0];
                         const heightData = event.data["datawrapper-height"][chartId];
                         if (heightData) {
                             const height = heightData + "px";
                             iframe.style.height = height;
                         }
                    }
                }
            };

            window.addEventListener("message", handleMessage);
            return () => window.removeEventListener("message", handleMessage);
        }
    }, [src]);

    if (!src) {
        return null;
    }

    return (
        <iframe
            ref={iframeRef}
            title={title || "Mapa interactivo"}
            aria-label="Mapa coroplético"
            src={src}
            scrolling="no"
            frameBorder="0"
            style={{ width: '0', minWidth: '100%', border: 'none', height: '627px' }}
            data-external="1"
        ></iframe>
    );
}
