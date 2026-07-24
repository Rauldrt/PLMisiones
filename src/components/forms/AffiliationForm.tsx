'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { submitFormAction } from '@/actions/submissions';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

export function AffiliationForm() {
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    email: '',
    phone: '',
    locality: '',
    address: '',
    occupation: '',
    comments: '',
  });

  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.name || !formData.dni || !formData.email || !formData.phone || !formData.locality || !formData.address) {
      toast({
        variant: 'destructive',
        title: 'Campos requeridos vacíos',
        description: 'Por favor, completa todos los campos marcados con asterisco (*).',
      });
      return;
    }

    if (!/^\d{7,10}$/.test(formData.dni.trim())) {
      toast({
        variant: 'destructive',
        title: 'DNI inválido',
        description: 'El DNI debe contener entre 7 y 10 dígitos numéricos, sin puntos ni espacios.',
      });
      return;
    }

    startTransition(async () => {
      const result = await submitFormAction('afiliacion', formData);
      if (result.success) {
        setSubmitted(true);
        toast({
          title: 'Solicitud enviada',
          description: 'Tu solicitud de afiliación fue registrada con éxito.',
        });
        setFormData({
          name: '',
          dni: '',
          email: '',
          phone: '',
          locality: '',
          address: '',
          occupation: '',
          comments: '',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error al enviar',
          description: result.message,
        });
      }
    });
  };

  if (submitted) {
    return (
      <Card className="bg-card/90 border border-white/60 shadow-[0_25px_60px_-15px_rgba(139,31,164,0.1)] rounded-[2rem] backdrop-blur-lg w-full text-foreground text-center p-8">
        <CardContent className="space-y-6 pt-6">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
            <Icons.Check className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <CardTitle className="font-headline text-3xl text-accent">¡Solicitud Registrada!</CardTitle>
            <CardDescription className="text-base">
              Tu solicitud de afiliación al Partido Libertario de Misiones ha sido enviada con éxito. 
              Nos pondremos en contacto contigo a la brevedad para finalizar el trámite físico de afiliación.
            </CardDescription>
          </div>
          <Button 
            onClick={() => setSubmitted(false)}
            className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-300"
          >
            Enviar otra solicitud
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/90 border border-white/60 shadow-[0_25px_60px_-15px_rgba(139,31,164,0.1)] rounded-[2rem] backdrop-blur-lg w-full text-foreground p-2 md:p-6">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-accent text-center">Ficha de Pre-Afiliación</CardTitle>
        <CardDescription className="text-center text-base">
          Completa tus datos para iniciar tu trámite de afiliación. La libertad te necesita en Misiones.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="af-name" className="text-foreground/80">Nombre Completo *</Label>
              <Input
                id="af-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Juan Carlos Pérez"
                className="bg-muted/80 border-input/60 focus:border-primary/50 focus:bg-background rounded-xl transition-colors duration-200"
                disabled={isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="af-dni" className="text-foreground/80">Número de DNI (sin puntos) *</Label>
              <Input
                id="af-dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="35123456"
                className="bg-muted/80 border-input/60 focus:border-primary/50 focus:bg-background rounded-xl transition-colors duration-200"
                disabled={isPending}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="af-email" className="text-foreground/80">Correo Electrónico *</Label>
              <Input
                id="af-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="juan.perez@example.com"
                className="bg-muted/80 border-input/60 focus:border-primary/50 focus:bg-background rounded-xl transition-colors duration-200"
                disabled={isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="af-phone" className="text-foreground/80">Celular / WhatsApp *</Label>
              <Input
                id="af-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="3764556677"
                className="bg-muted/80 border-input/60 focus:border-primary/50 focus:bg-background rounded-xl transition-colors duration-200"
                disabled={isPending}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="af-locality" className="text-foreground/80">Localidad de Residencia *</Label>
              <Input
                id="af-locality"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                placeholder="Posadas"
                className="bg-muted/80 border-input/60 focus:border-primary/50 focus:bg-background rounded-xl transition-colors duration-200"
                disabled={isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="af-address" className="text-foreground/80">Domicilio Completo *</Label>
              <Input
                id="af-address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Av. Corrientes 1234, Piso 2 Dto A"
                className="bg-muted/80 border-input/60 focus:border-primary/50 focus:bg-background rounded-xl transition-colors duration-200"
                disabled={isPending}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="af-occupation" className="text-foreground/80">Profesión / Ocupación / Estudios</Label>
            <Input
              id="af-occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="Comerciante / Estudiante de Ingeniería / Abogado"
              className="bg-muted/80 border-input/60 focus:border-primary/50 focus:bg-background rounded-xl transition-colors duration-200"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="af-comments" className="text-foreground/80">¿Por qué te gustaría afiliarte? (Opcional)</Label>
            <Textarea
              id="af-comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Comentarios adicionales o motivos para sumarte..."
              rows={3}
              className="bg-muted/80 border-input/60 focus:border-primary/50 focus:bg-background rounded-xl resize-none transition-colors duration-200"
              disabled={isPending}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full py-6 bg-primary hover:bg-primary/90 text-white font-semibold text-base transition-all duration-300 shadow-[0_4px_20px_rgba(139,31,164,0.25)] hover:shadow-[0_6px_25px_rgba(139,31,164,0.35)]"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Registrando Solicitud...
                </span>
              ) : 'Enviar Solicitud de Pre-Afiliación'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
