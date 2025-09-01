'use client';
import { useState, useEffect, useTransition } from 'react';
import { getFormDefinitionAction } from '@/actions/data';
import { saveFormDefinition } from '@/actions/admin';
import type { FormDefinition, FormFieldDefinition } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formNames = ['afiliacion', 'contacto', 'fiscales'];

interface FormEditorProps {
  formName: string;
}

function FormEditor({ formName }: FormEditorProps) {
    const [definition, setDefinition] = useState<FormDefinition | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, startSavingTransition] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        async function fetchData() {
          setIsLoading(true);
          const data = await getFormDefinitionAction(formName);
          setDefinition(data);
          setIsLoading(false);
        }
        fetchData();
    }, [formName]);

    const handleSave = () => {
        if (!definition) return;
        startSavingTransition(async () => {
          const result = await saveFormDefinition(formName, definition);
          if (result.success) {
            toast({ title: 'Éxito', description: result.message });
          } else {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar el formulario.' });
          }
        });
    };

    const handleMetaChange = (field: 'title' | 'description', value: string) => {
        if (!definition) return;
        setDefinition({ ...definition, [field]: value });
    };

    const handleFieldChange = (index: number, field: keyof FormFieldDefinition, value: string | boolean) => {
        if (!definition) return;
        const newFields = [...definition.fields];
        (newFields[index] as any)[field] = value;
        setDefinition({ ...definition, fields: newFields });
    };

    const addField = () => {
        if (!definition) return;
        const newField: FormFieldDefinition = { name: `campo_${Date.now()}`, label: 'Nuevo Campo', type: 'text', placeholder: '', required: false };
        setDefinition({ ...definition, fields: [...definition.fields, newField] });
    };

    const removeField = (index: number) => {
        if (!definition) return;
        const newFields = definition.fields.filter((_, i) => i !== index);
        setDefinition({ ...definition, fields: newFields });
    };

    if (isLoading) return <p>Cargando editor...</p>;
    if (!definition) return <p>No se pudo cargar la definición del formulario.</p>;
    
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Configuración General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-1">
                        <Label htmlFor="form-title">Título del Formulario</Label>
                        <Input id="form-title" value={definition.title} onChange={e => handleMetaChange('title', e.target.value)} />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="form-description">Descripción</Label>
                        <Input id="form-description" value={definition.description} onChange={e => handleMetaChange('description', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                     <CardTitle>Campos del Formulario</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4">
                    {definition.fields.map((field, index) => (
                        <div key={index} className="rounded-lg border p-4 space-y-4">
                             <div className="flex justify-between items-center">
                                <h4 className="font-semibold">Campo: {field.label}</h4>
                                <Button variant="destructive" size="icon" onClick={() => removeField(index)}><Icons.Trash className="w-4 h-4"/></Button>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="space-y-1">
                                    <Label>Nombre (ID)</Label>
                                    <Input value={field.name} onChange={e => handleFieldChange(index, 'name', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Etiqueta</Label>
                                    <Input value={field.label} onChange={e => handleFieldChange(index, 'label', e.target.value)} />
                                </div>
                                 <div className="space-y-1">
                                    <Label>Tipo de Campo</Label>
                                     <Select value={field.type} onValueChange={(v) => handleFieldChange(index, 'type', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Texto</SelectItem>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="tel">Teléfono</SelectItem>
                                            <SelectItem value="number">Número</SelectItem>
                                            <SelectItem value="textarea">Área de Texto</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                  <div className="space-y-1">
                                    <Label>Placeholder</Label>
                                    <Input value={field.placeholder || ''} onChange={e => handleFieldChange(index, 'placeholder', e.target.value)} />
                                </div>
                                <div className="flex items-center space-x-2 pt-4">
                                    <Switch id={`required-${index}`} checked={field.required} onCheckedChange={(c) => handleFieldChange(index, 'required', c)} />
                                    <Label htmlFor={`required-${index}`}>Requerido</Label>
                                </div>
                             </div>
                        </div>
                    ))}
                    <Button variant="outline" onClick={addField}><Icons.Plus className="mr-2 h-4 w-4"/> Agregar Campo</Button>
                </CardContent>
            </Card>
             <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Guardando...' : 'Guardar Cambios en Formulario'}
                </Button>
            </div>
        </div>
    )
}

export default function ManageFormsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Gestionar Formularios</h1>
        <p className="text-muted-foreground">Administra la estructura de los formularios del sitio.</p>
      </div>

       <Tabs defaultValue={formNames[0]}>
        <TabsList>
            {formNames.map(name => (
                 <TabsTrigger key={name} value={name} className="capitalize">{name}</TabsTrigger>
            ))}
        </TabsList>
        {formNames.map(name => (
            <TabsContent key={name} value={name}>
                <FormEditor formName={name} />
            </TabsContent>
        ))}
        </Tabs>
    </div>
  );
}
