'use client';
import { useState, useEffect, useTransition } from 'react';
import { getOrganigramaAction } from '@/actions/data';
import { saveOrganigrama } from '@/actions/admin';
import type { OrganigramaMember } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function ManageOrganigramaPage() {
  const [items, setItems] = useState<OrganigramaMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getOrganigramaAction();
      setItems(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = () => {
    startSavingTransition(async () => {
      const result = await saveOrganigrama(items);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar el organigrama.' });
      }
    });
  };

  const handleFieldChange = (index: number, field: keyof OrganigramaMember, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };
  
  const addItem = () => {
    setItems([...items, { id: new Date().getTime().toString(), name: 'Nuevo Miembro', role: 'Cargo', imageUrl: 'https://picsum.photos/200/200', imageHint: 'person portrait' }]);
  }
  
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Gestionar Organigrama</h1>
        <p className="text-muted-foreground">Administra los miembros del organigrama que aparecen en la página de inicio.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Miembros del Organigrama</CardTitle>
          <CardDescription>Edita, agrega o elimina miembros. Los cambios se guardan todos juntos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? <p>Cargando...</p> : items.map((item, index) => (
            <div key={item.id} className="rounded-lg border p-4 space-y-4 relative">
              <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                      <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="rounded-lg object-cover h-16 w-16" />
                      <h3 className="font-semibold font-headline text-lg">Miembro {index + 1}</h3>
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}><Icons.Trash className="w-4 h-4"/></Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor={`name-${index}`}>Nombre</Label>
                  <Input id={`name-${index}`} value={item.name} onChange={e => handleFieldChange(index, 'name', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`role-${index}`}>Cargo</Label>
                  <Input id={`role-${index}`} value={item.role} onChange={e => handleFieldChange(index, 'role', e.target.value)} />
                </div>
              </div>
               <div className="space-y-1">
                  <Label htmlFor={`imageUrl-${index}`}>URL de Imagen</Label>
                  <Input id={`imageUrl-${index}`} value={item.imageUrl} onChange={e => handleFieldChange(index, 'imageUrl', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`imageHint-${index}`}>Pista de Imagen (para IA)</Label>
                  <Input id={`imageHint-${index}`} value={item.imageHint || ''} onChange={e => handleFieldChange(index, 'imageHint', e.target.value)} placeholder="Ej: man portrait smiling" />
                </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4">
             <Button variant="outline" onClick={addItem}><Icons.Plus className="mr-2 h-4 w-4"/> Agregar Miembro</Button>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
