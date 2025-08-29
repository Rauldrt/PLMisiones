'use client';
// This is a placeholder for the full Mosaic management UI.
// A complete implementation would be similar to the Banner management page,
// allowing users to edit each mosaic item's properties.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ManageMosaicPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Gestionar Mosaico</h1>
        <p className="text-muted-foreground">Administra los items del mosaico de la página de inicio.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración del Mosaico</CardTitle>
          <CardDescription>
            Funcionalidad en desarrollo. En una versión futura, aquí podrás editar las imágenes, títulos y tamaños de cada
            elemento del mosaico.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>El manejo del mosaico se implementará próximamente.</p>
        </CardContent>
      </Card>
    </div>
  );
}
