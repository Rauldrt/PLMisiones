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
    }, [src]);

    return (
        <iframe
            ref={iframeRef}
            title={title}
            aria-label="Mapa coroplético"
            src={src}
            scrolling="no"
            frameBorder="0"
            style={{ width: '0', minWidth: '100%', border: 'none', height: '627px' }}
            data-external="1"
        ></iframe>
    );
}
