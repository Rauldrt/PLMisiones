
'use client';

import { useState, useMemo } from 'react';
import type { Referente, MapEmbed } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { InteractiveMap } from '@/components/InteractiveMap';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ReferentesClientProps {
  initialReferentes: Referente[];
  initialMaps: MapEmbed[];
}

export function ReferentesClient({ initialReferentes, initialMaps }: ReferentesClientProps) {
    const [referentes] = useState<Referente[]>(initialReferentes);
    const [maps] = useState<MapEmbed[]>(initialMaps);
    const localityCounts = referentes.reduce((acc, ref) => {
        if (ref.locality) {
            const loc = ref.locality.trim();
            acc[loc] = (acc[loc] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const activeLocalities = Object.entries(localityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredReferentes = useMemo(() => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return referentes.filter((referente) =>
            (referente.name.toLowerCase().includes(lowerSearchTerm)) ||
            (referente.locality?.toLowerCase().includes(lowerSearchTerm))
        );
    }, [referentes, searchTerm]);

    const showReferentes = searchTerm !== '' && filteredReferentes.length > 0;
    const showNoResults = searchTerm !== '' && filteredReferentes.length === 0;

    return (
        <div className="container max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-16">
            <div>
                <div className="max-w-xl mx-auto mb-12">
                    <Input
                        type="text"
                        placeholder="Buscá por nombre o localidad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-base"
                    />
                    
                    {activeLocalities.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center mt-4">
                            <span className="text-xs text-muted-foreground self-center mr-1">Filtros por localidad:</span>
                            {activeLocalities.map(([locality, count]) => (
                                <button
                                    key={locality}
                                    onClick={() => setSearchTerm(searchTerm === locality ? '' : locality)}
                                    className={cn(
                                        "text-xs px-3 py-1 rounded-full border transition-all duration-200 flex items-center gap-1 active:scale-95",
                                        searchTerm === locality
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/30"
                                            : "bg-background/40 hover:bg-muted text-foreground/80 border-border"
                                    )}
                                >
                                    <span>{locality}</span>
                                    <span className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded-full",
                                        searchTerm === locality 
                                            ? "bg-white/20 text-white" 
                                            : "bg-muted text-muted-foreground"
                                    )}>
                                        {count}
                                    </span>
                                </button>
                            ))}
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-xs text-primary hover:underline self-center ml-1"
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {showReferentes ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredReferentes.map((referente) => (
                            <Card key={referente.id} className="flex flex-col text-center items-center bg-card/90 border border-white/80 dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12),0_10px_30px_-10px_rgba(139,31,164,0.15)] hover:border-orange-500/40 dark:hover:border-orange-500/50 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.22),0_0_25px_rgba(249,115,22,0.3),0_15px_35px_-5px_rgba(139,31,164,0.3)] rounded-[2.5rem] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2.5">
                                <CardHeader className="p-6">
                                    <Avatar className="w-32 h-32 mx-auto border-4 border-primary">
                                        <AvatarImage src={referente.imageUrl} alt={referente.name} />
                                        <AvatarFallback>{referente.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </CardHeader>
                                <CardContent className="p-6 pt-0 flex-grow flex flex-col">
                                    <CardTitle className="font-headline text-2xl">{referente.name}</CardTitle>
                                    <p className="text-primary font-semibold mt-1">{referente.role}</p>
                                    {referente.locality && (
                                        <div className="text-muted-foreground text-sm mt-2 flex items-center justify-center gap-2">
                                            <Icons.Location className="w-4 h-4"/>
                                            <span>{referente.locality}</span>
                                        </div>
                                    )}
                                    <CardDescription className="mt-4 flex-grow">{referente.bio}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : showNoResults ? (
                    <div className="text-center text-muted-foreground py-16">
                        <p>No se encontraron referentes con ese criterio de búsqueda.</p>
                    </div>
                ) : (
                   <div className="text-center text-muted-foreground py-16">
                        <p>Ingresá un nombre o localidad para encontrar un referente.</p>
                    </div>
                )}
            </div>

            {maps.map(map => (
                <Card key={map.id} className="bg-card/90 border border-white/80 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15),0_15px_30px_-20px_rgba(139,31,164,0.2)] rounded-[2.5rem] backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">{map.title}</CardTitle>
                         <CardDescription>Explorá el mapa interactivo de la provincia.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <InteractiveMap map={map} />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
