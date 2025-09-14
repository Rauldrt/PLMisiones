
'use client';

import { useState } from 'react';
import type { Referente, MapEmbed } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { InteractiveMap } from '@/components/InteractiveMap';
import { Skeleton } from '@/components/ui/skeleton';

interface ReferentesClientProps {
  initialReferentes: Referente[];
  initialMaps: MapEmbed[];
}

export function ReferentesClient({ initialReferentes, initialMaps }: ReferentesClientProps) {
    const [referentes] = useState<Referente[]>(initialReferentes);
    const [maps] = useState<MapEmbed[]>(initialMaps);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredReferentes = referentes.filter((referente) =>
        (referente.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (referente.locality?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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
                </div>

                {searchTerm !== '' && filteredReferentes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredReferentes.map((referente) => (
                            <Card key={referente.id} className="flex flex-col text-center items-center bg-card border-border">
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
                ) : searchTerm !== '' ? (
                    <div className="text-center text-muted-foreground py-16">
                        <p>No se encontraron referentes con ese criterio de búsqueda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {referentes.map((referente) => (
                            <Card key={referente.id} className="flex flex-col text-center items-center bg-card border-border">
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
                )}
            </div>

            {maps.map(map => (
                <Card key={map.id}>
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
