'use client';

import Image from 'next/image';
import type { Referente } from '@/lib/types';
import { cn } from '@/lib/utils';

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
        'relative w-full cursor-pointer overflow-hidden rounded-lg transition-all duration-500 ease-in-out',
        isExpanded 
          ? 'h-[400px] bg-card border border-border' 
          : 'h-[280px] bg-transparent border-none'
      )}
    >
      <div
        className={cn(
          'absolute transition-all duration-500 ease-in-out overflow-hidden',
          isExpanded
            ? 'w-full h-64 top-0 left-0 rounded-b-none rounded-t-lg'
            : 'w-36 h-36 top-[60px] left-1/2 -translate-x-1/2 rounded-full'
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
      
      <div 
        className={cn(
          "absolute bottom-4 left-0 right-0 p-4 text-center transition-opacity duration-300 ease-in-out",
          isExpanded ? "opacity-0" : "opacity-100 delay-200"
        )}
      >
        <h3 className="font-headline text-xl font-semibold">
          {referente.name}
        </h3>
        <p className="text-sm font-medium text-foreground/80">{referente.role}</p>
      </div>
      
      <div 
        className={cn(
          "absolute top-64 left-0 right-0 p-6 transition-opacity duration-300 ease-in-out",
          isExpanded ? "opacity-100 delay-200" : "opacity-0 pointer-events-none"
        )}
      >
        <h3 className="font-headline text-2xl font-bold">{referente.name}</h3>
        <p className="text-base font-medium text-foreground/80 mt-1">{referente.role}</p>
        <p className="text-sm text-foreground/80 mt-4 line-clamp-5">{referente.bio}</p>
      </div>
    </div>
  );
}
