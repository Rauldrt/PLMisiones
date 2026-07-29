'use client';

import type { LinkPreviewMetadata } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LinkPreviewCardProps {
  metadata?: LinkPreviewMetadata;
  className?: string;
}

export function LinkPreviewCard({ metadata, className }: LinkPreviewCardProps) {
  if (!metadata || !metadata.url) return null;

  return (
    <a
      href={metadata.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex flex-col sm:flex-row items-stretch rounded-lg border border-border bg-card/45 text-card-foreground hover:bg-muted/35 hover:border-border/80 transition-all overflow-hidden w-full text-left mt-3 group shadow-sm",
        className
      )}
    >
      {metadata.imageUrl && (
        <div className="relative shrink-0 sm:w-28 md:w-32 min-h-[90px] bg-muted/20 overflow-hidden border-b sm:border-b-0 sm:border-r border-border">
          <img
            src={metadata.imageUrl}
            alt={metadata.title || "Previsualización"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex-grow p-3.5 flex flex-col justify-center space-y-1">
        {metadata.siteName && (
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
            {metadata.siteName}
          </span>
        )}
        <h5 className="font-bold text-xs text-foreground group-hover:text-accent transition-colors line-clamp-1 leading-snug">
          {metadata.title || metadata.url}
        </h5>
        {metadata.description && (
          <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
            {metadata.description}
          </p>
        )}
      </div>
    </a>
  );
}
