'use client';

import Image from 'next/image';
import type { Referente } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ExpandingCandidateCardProps {
  referente: Referente;
  isExpanded: boolean;
  onClick: () => void;
}

export function ExpandingCandidateCard({ referente, isExpanded, onClick }: ExpandingCandidateCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative w-full cursor-pointer overflow-hidden bg-card border-border rounded-lg transition-all duration-500 ease-in-out',
        isExpanded ? 'h-[420px]' : 'h-[300px]'
      )}
    >
      {/* Image container that handles the morphing effect */}
      <div
        className={cn(
          'absolute transition-all duration-500 ease-in-out',
          isExpanded
            ? 'w-full h-48 top-0 left-0 rounded-b-none rounded-t-lg'
            : 'w-40 h-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+20px)] rounded-full'
        )}
      >
        <Image
          src={referente.imageUrl}
          alt={referente.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
          data-ai-hint={referente.imageHint}
        />
      </div>
      
      {/* Text Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
        {/* Name and Role - Visible in both states, but moves */}
        <div
          className={cn(
            'transition-all duration-500 ease-in-out',
            isExpanded ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
          )}
        >
          <h3 className="font-headline text-xl font-semibold text-primary">
            {referente.name}
          </h3>
          <p className="text-sm font-medium text-foreground/80">{referente.role}</p>
        </div>
      </div>
      
      {/* Expanded Content - Only visible when expanded */}
      <div 
        className={cn(
          "absolute top-48 left-0 right-0 p-4 transition-opacity duration-300 ease-in-out delay-200",
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <CardTitle className="font-headline text-xl text-primary">{referente.name}</CardTitle>
        <p className="text-sm font-medium text-foreground/80">{referente.role}</p>
        <p className="text-sm text-foreground/80 mt-4 line-clamp-5">{referente.bio}</p>
      </div>
    </div>
  );
}