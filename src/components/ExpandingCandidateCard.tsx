'use client';

import Image from 'next/image';
import { Referente } from '@/lib/types';
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
      className={cn(
        'relative cursor-pointer transition-all duration-500 ease-in-out',
        isExpanded ? 'h-[420px]' : 'h-[300px]'
      )}
      onClick={onClick}
    >
      {/* Collapsed State */}
      <div className={cn(
        'absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300',
        isExpanded ? 'opacity-0' : 'opacity-100'
      )}>
        <div className="relative h-40 w-40">
          <Image
            src={referente.imageUrl}
            alt={referente.name}
            fill
            className="rounded-full object-cover"
            sizes="160px"
            data-ai-hint={referente.imageHint}
          />
        </div>
        <div className="mt-4 text-center">
          <h3 className="font-headline text-xl font-semibold text-primary transition-colors group-hover:text-accent">
            {referente.name}
          </h3>
          <p className="text-sm font-medium text-foreground/80">{referente.role}</p>
        </div>
      </div>

      {/* Expanded State */}
      <div className={cn(
        'absolute inset-0 transition-opacity duration-300',
        isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}>
        <Card className="h-full w-full flex flex-col bg-card border-border overflow-hidden">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full">
              <Image
                src={referente.imageUrl}
                alt={referente.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={referente.imageHint}
              />
            </div>
            <div className="p-4">
              <CardTitle className="font-headline text-xl text-primary">{referente.name}</CardTitle>
              <p className="text-sm font-medium text-foreground/80">{referente.role}</p>
            </div>
          </CardHeader>
          <CardContent className="flex-grow px-4 pb-4">
            <p className="text-sm text-foreground/80 line-clamp-5">{referente.bio}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
