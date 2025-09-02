
'use client';

import Image from 'next/image';
import type { Candidate } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ExpandingCandidateCardProps {
  candidate: Candidate;
  isExpanded: boolean;
  onClick: () => void;
}

export function ExpandingCandidateCard({ candidate, isExpanded, onClick }: ExpandingCandidateCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative w-full cursor-pointer overflow-hidden rounded-lg transition-all duration-500 ease-in-out',
        isExpanded 
          ? 'h-[540px] bg-card border border-border' 
          : 'h-[280px] bg-transparent border-none'
      )}
    >
      <div
        className={cn(
          'absolute transition-all duration-500 ease-in-out overflow-hidden',
          isExpanded
            ? 'w-full h-96 top-0 left-0 rounded-b-none rounded-t-lg'
            : 'w-36 h-36 top-[60px] left-1/2 -translate-x-1/2 rounded-full group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-black/50'
        )}
      >
        <Image
          src={candidate.imageUrl}
          alt={candidate.name}
          fill
          className="object-cover transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 33vw"
          data-ai-hint={candidate.imageHint}
        />
      </div>
      
      <div 
        className={cn(
          "absolute bottom-4 left-0 right-0 p-4 text-center text-white transition-opacity duration-300 ease-in-out",
          isExpanded ? "opacity-0" : "opacity-100 delay-200"
        )}
      >
        <h3 className="font-headline text-xl font-semibold drop-shadow-md">
          {candidate.name}
        </h3>
        <p className="text-sm font-medium text-white/80 drop-shadow-md">{candidate.role}</p>
      </div>
      
      <div 
        className={cn(
          "absolute top-96 left-0 right-0 p-6 transition-opacity duration-300 ease-in-out",
          isExpanded ? "opacity-100 delay-200" : "opacity-0 pointer-events-none"
        )}
      >
        <h3 className="font-headline text-2xl font-bold">{candidate.name}</h3>
        <p className="text-base font-medium text-foreground/80 mt-1">{candidate.role}</p>
        <p className="text-sm text-foreground/80 mt-4 line-clamp-3">{candidate.bio}</p>
      </div>
    </div>
  );
}
