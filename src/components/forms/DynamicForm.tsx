'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { getGoogleFormAction } from '@/actions/data';
import { submitFormAction } from '@/actions/submissions';
import type { GoogleForm } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

interface DynamicFormProps {
  formId: 'contacto' | 'afiliacion' | 'fiscales';
  onSuccess?: () => void;
}

export function DynamicForm({ formId, onSuccess }: DynamicFormProps) {
  const [form, setForm] = useState<GoogleForm | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadFormConfig() {
      setLoadingConfig(true);
      try {
        const config = await getGoogleFormAction(formId);
        if (config) {
          setForm(config);
          // Initialize state keys
          const initialData: Record<string, string> = {};
          config.fields?.forEach(field => {
            initialData[field.id] = field.type === 'select' ? (field.options?.[0] || '') : '';
          });
          setFormData(initialData);
        }
      } catch (err) {
        console.error("Failed to load form config:", err);
      } finally {
        setLoadingConfig(false);
      }
    }
    loadFormConfig();
  }, [formId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (fieldId: string, value: string) => {
    setFormData({
      ...formData,
      [fieldId]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !form.fields) return;

    // 1. Validate required fields
    for (const field of form.fields) {
      const val = formData[field.id]?.trim();
      if (field.required && !val) {
        toast({
          variant: 'destructive',
          title: 'Campo requerido vacío',
          description: `Por favor completa el campo "${field.label}".`,
        });
        return;
      }

      // 2. Specialized DNI validation
      if (field.id.toLowerCase() === 'dni' && val) {
        if (!/^\d{7,10}$/.test(val)) {
          toast({
            variant: 'destructive',
            title: 'DNI inválido',
            description: 'El DNI debe tener entre 7 y 10 números, sin puntos ni espacios.',
          });
          return;
        }
      }

      // 3. Email validation
      if (field.type === 'email' && val) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          toast({
            variant: 'destructive',
            title: 'Email inválido',
            description: 'Por favor, ingresa un correo electrónico válido.',
          });
          return;
        }
      }
    }

    // Submit form action
    startTransition(async () => {
      const result = await submitFormAction(formId, formData);
      if (result.success) {
        setSubmitted(true);
        toast({
          title: 'Formulario enviado',
          description: result.message,
        });
        if (onSuccess) onSuccess();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error al enviar',
          description: result.message,
        });
      }
    });
  };

  if (loadingConfig) {
    return (
      <Card className="bg-card/90 border border-white/88 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15),0_15px_30px_-20px_rgba(139,31,164,0.2)] rounded-[2.5rem] backdrop-blur-lg w-full text-foreground p-6 min-h-[300px] flex flex-col items-center justify-center">
        <span className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-2" />
        <p className="text-muted-foreground text-sm">Cargando formulario...</p>
      </Card>
    );
  }

  if (!form) {
    return (
      <Card className="bg-card/90 border border-white/80 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15),0_15px_30px_-20px_rgba(139,31,164,0.2)] rounded-[2.5rem] backdrop-blur-lg w-full text-foreground p-6 text-center">
        <CardTitle className="text-red-500 font-headline mb-2">Formulario no disponible</CardTitle>
        <CardDescription>Ocurrió un error al cargar la configuración del formulario.</CardDescription>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card className="bg-card/90 border border-white/80 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15),0_15px_30px_-20px_rgba(139,31,164,0.2)] rounded-[2.5rem] backdrop-blur-lg w-full text-foreground text-center p-8">
        <CardContent className="space-y-6 pt-6">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
            <Icons.Check className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <CardTitle className="font-headline text-3xl text-accent">¡Envío Exitoso!</CardTitle>
            <CardDescription className="text-base">
              Tus datos han sido registrados correctamente en nuestra base de datos.
            </CardDescription>
          </div>
          <Button 
            onClick={() => setSubmitted(false)}
            className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-300"
          >
            Enviar otra respuesta
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/90 border border-white/80 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15),0_15px_30px_-20px_rgba(139,31,164,0.2)] rounded-[2.5rem] backdrop-blur-lg w-full text-foreground p-2 md:p-6">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-accent text-center">{form.title}</CardTitle>
        {form.description && (
          <CardDescription className="text-center text-base mt-2">{form.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {form.fields?.map((field) => {
              // Standard inputs layout: grid if short, full-width if message or occupation/address
              const isFullWidth = field.type === 'textarea' || field.id === 'address' || field.id === 'occupation' || field.id === 'comments';
              
              return (
                <div key={field.id} className={isFullWidth ? "col-span-1 md:col-span-2 space-y-2" : "col-span-1 space-y-2"}>
                  <Label htmlFor={`dyn-${field.id}`} className="text-foreground/80 font-medium">
                    {field.label} {field.required ? '*' : ''}
                  </Label>
                  
                  {field.type === 'textarea' ? (
                    <Textarea
                      id={`dyn-${field.id}`}
                      name={field.id}
                      value={formData[field.id] || ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      rows={field.id === 'message' ? 4 : 3}
                      className="bg-muted/80 border-input/60 focus:border-primary/50 focus:bg-background rounded-xl resize-none transition-colors duration-200"
                      disabled={isPending}
                      required={field.required}
                    />
                  ) : field.type === 'select' ? (
                    <Select 
                      value={formData[field.id] || ''} 
                      onValueChange={(val) => handleSelectChange(field.id, val)}
                      disabled={isPending}
                    >
                      <SelectTrigger id={`dyn-${field.id}`} className="bg-muted/80 border-input/60 focus:border-primary/50 focus:bg-background rounded-xl transition-all duration-200">
                        <SelectValue placeholder={field.placeholder || "Selecciona una opción"} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={`dyn-${field.id}`}
                      name={field.id}
                      type={field.type}
                      value={formData[field.id] || ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="bg-muted/80 border-input/60 focus:border-primary/50 focus:bg-background rounded-xl transition-colors duration-200"
                      disabled={isPending}
                      required={field.required}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full py-6 bg-primary hover:bg-primary/90 text-white font-semibold text-base transition-all duration-300 shadow-[0_4px_20px_rgba(139,31,164,0.25)] hover:shadow-[0_6px_25px_rgba(139,31,164,0.35)]"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Enviando datos...
                </span>
              ) : 'Enviar Formulario'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
