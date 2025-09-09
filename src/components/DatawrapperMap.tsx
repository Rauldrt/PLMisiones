
'use client';
import { useEffect } from 'react';
import Script from 'next/script';

interface DatawrapperMapProps {
    title: string;
    src: string;
    scriptContent: string;
}

export function DatawrapperMap({ title, src, scriptContent }: DatawrapperMapProps) {
    return (
        <>
            <iframe
                title={title}
                aria-label="Mapa coroplético"
                src={src}
                scrolling="no"
                frameBorder="0"
                style={{ width: '0', minWidth: '100%', border: 'none', height: '627px' }}
                data-external="1"
            ></iframe>
            <Script
                id={`datawrapper-script-${src}`}
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: scriptContent }}
            />
        </>
    );
}
