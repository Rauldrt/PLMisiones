
'use client';
import { useState, useEffect } from 'react';
import { getFormSubmissionsAction } from '@/actions/data';
import type { FormSubmission } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';

const formNames = ['afiliacion', 'contacto', 'fiscales'];

export default function ViewSubmissionsPage() {
  const [submissions, setSubmissions] = useState<{afiliacion: FormSubmission[], contacto: FormSubmission[], fiscales: FormSubmission[]}>({ afiliacion: [], contacto: [], fiscales: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [afiliacionData, contactoData, fiscalesData] = await Promise.all([
          getFormSubmissionsAction('afiliacion'),
          getFormSubmissionsAction('contacto'),
          getFormSubmissionsAction('fiscales'),
        ]);
        setSubmissions({ afiliacion: afiliacionData, contacto: contactoData, fiscales: fiscalesData });
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
        // Handle error state if necessary
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const renderTable = (data: FormSubmission[]) => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      );
    }
    if (data.length === 0) {
      return <p className="text-muted-foreground">No hay envíos para este formulario todavía.</p>;
    }
    
    // Get all unique headers from all submissions
    const allHeaders = data.reduce((acc, curr) => {
      Object.keys(curr).forEach(key => {
        if (!acc.includes(key)) {
          acc.push(key);
        }
      });
      return acc;
    }, [] as string[]);
    
    // Prioritize certain columns and hide 'id'
    const orderedHeaders = ['submittedAt', 'nombreCompleto', 'email', 'telefono', 'dni', 'localidad', 'asunto', 'mensaje'].filter(h => allHeaders.includes(h));
    const otherHeaders = allHeaders.filter(h => !orderedHeaders.includes(h) && h !== 'id');
    const headers = [...orderedHeaders, ...otherHeaders];


    return (
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map(header => <TableHead key={header} className="capitalize">{header.replace(/([A-Z])/g, ' $1')}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {headers.map(header => <TableCell key={header}>{String(row[header] ?? '')}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Envíos de Formularios</h1>
        <p className="text-muted-foreground">Revisa los datos enviados a través de los formularios del sitio. Los datos se guardan en Firestore.</p>
      </div>

       <Tabs defaultValue={formNames[0]}>
        <TabsList>
            {formNames.map(name => (
                 <TabsTrigger key={name} value={name} className="capitalize">{name}</TabsTrigger>
            ))}
        </TabsList>
        <TabsContent value="afiliacion">
             <Card>
                <CardHeader>
                <CardTitle>Envíos de Afiliación</CardTitle>
                <CardDescription>Personas que completaron el formulario para afiliarse.</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderTable(submissions.afiliacion)}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="contacto">
             <Card>
                <CardHeader>
                <CardTitle>Envíos de Contacto</CardTitle>
                <CardDescription>Mensajes y consultas enviadas desde el pie de página.</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderTable(submissions.contacto)}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="fiscales">
             <Card>
                <CardHeader>
                <CardTitle>Inscripciones de Fiscales</CardTitle>
                <CardDescription>Voluntarios que se inscribieron para fiscalizar.</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderTable(submissions.fiscales)}
                </CardContent>
            </Card>
        </TabsContent>
        </Tabs>
    </div>
  );
}
