'use client';
import { useEffect } from 'react';

interface DatawrapperMapProps {
    title: string;
    src: string;
}

export function DatawrapperMap({ title, src }: DatawrapperMapProps) {
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data["datawrapper-height"]) {
                const iframes = document.querySelectorAll("iframe");
                for (const chartId in event.data["datawrapper-height"]) {
                    for (let i = 0; i < iframes.length; i++) {
                        if (iframes[i].contentWindow === event.source) {
                            const height = event.data["datawrapper-height"][chartId] + "px";
                            iframes[i].style.height = height;
                        }
                    }
                }
            }
        };

        window.addEventListener("message", handleMessage);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    return (
        <iframe
            title={title}
            aria-label="Mapa coroplético"
            src={src}
            scrolling="no"
            frameBorder="0"
            style={{ width: '0', minWidth: '100%', border: 'none' }}
            height="627"
            data-external="1"
        ></iframe>
    );
}
