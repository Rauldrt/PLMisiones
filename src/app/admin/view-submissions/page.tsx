'use client';
import { useState, useEffect } from 'react';
import { getFormSubmissions } from '@/lib/data';
import type { FormSubmission } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ViewSubmissionsPage() {
  const [submissions, setSubmissions] = useState<{afiliacion: FormSubmission[], contacto: FormSubmission[], fiscales: FormSubmission[]}>({ afiliacion: [], contacto: [], fiscales: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [afiliacionData, contactoData, fiscalesData] = await Promise.all([
        getFormSubmissions('afiliacion'),
        getFormSubmissions('contacto'),
        getFormSubmissions('fiscales'),
      ]);
      setSubmissions({ afiliacion: afiliacionData, contacto: contactoData, fiscales: fiscalesData });
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const renderTable = (data: FormSubmission[]) => {
    if (data.length === 0) {
      return <p>No hay envíos para este formulario.</p>;
    }
    const headers = Object.keys(data[0]);
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map(header => <TableHead key={header}>{header}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {headers.map(header => <TableCell key={header}>{String(row[header])}</TableCell>)}
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
        <p className="text-muted-foreground">Revisa los datos enviados a través de los formularios del sitio.</p>
      </div>

       <Tabs defaultValue="afiliacion">
        <TabsList>
            <TabsTrigger value="afiliacion">Afiliación</TabsTrigger>
            <TabsTrigger value="contacto">Contacto</TabsTrigger>
            <TabsTrigger value="fiscales">Fiscales</TabsTrigger>
        </TabsList>
        <TabsContent value="afiliacion">
             <Card>
                <CardHeader>
                <CardTitle>Envíos de Afiliación</CardTitle>
                </CardHeader>
                <CardContent>
                {isLoading ? <p>Cargando...</p> : renderTable(submissions.afiliacion)}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="contacto">
             <Card>
                <CardHeader>
                <CardTitle>Envíos de Contacto</CardTitle>
                </CardHeader>
                <CardContent>
                {isLoading ? <p>Cargando...</p> : renderTable(submissions.contacto)}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="fiscales">
             <Card>
                <CardHeader>
                <CardTitle>Inscripciones de Fiscales</CardTitle>
                </CardHeader>
                <CardContent>
                {isLoading ? <p>Cargando...</p> : renderTable(submissions.fiscales)}
                </CardContent>
            </Card>
        </TabsContent>
        </Tabs>

    </div>
  );
}
