
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Referente } from '@/lib/types';
import { getReferentesAction } from '@/actions/data';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';

const pageHeader = {
    path: "/referentes",
    title: "Nuestros Referentes",
    description: "Encontrá a los referentes del Partido Libertario en tu localidad.",
    icon: "UsersRound"
};

export default function ReferentesPage() {
    const [referentes, setReferentes] = useState<Referente[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadReferentes() {
            setIsLoading(true);
            const data = await getReferentesAction();
            setReferentes(data);
            setIsLoading(false);
        }
        loadReferentes();
    }, []);

    const filteredReferentes = referentes.filter((referente) =>
        (referente.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (referente.locality?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <PageHeader {...pageHeader} />
            <div className="container max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl mx-auto mb-12">
                    <Input
                        type="text"
                        placeholder="Buscá por nombre o localidad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-base"
                    />
                </div>

                {isLoading ? (
                    <div className="text-center text-muted-foreground">Cargando referentes...</div>
                ) : filteredReferentes.length > 0 ? (
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
                ) : (
                    <div className="text-center text-muted-foreground py-16">
                        <p>No se encontraron referentes con ese criterio de búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
