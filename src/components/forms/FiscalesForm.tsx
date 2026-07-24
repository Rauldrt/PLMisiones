'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { submitFormAction } from '@/actions/submissions';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

export function FiscalesForm() {
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    email: '',
    phone: '',
    locality: '',
    electoralSection: '',
    availability: 'full_day',
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

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      availability: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.name || !formData.dni || !formData.email || !formData.phone || !formData.locality || !formData.electoralSection) {
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
      const result = await submitFormAction('fiscales', formData);
      if (result.success) {
        setSubmitted(true);
        toast({
          title: 'Inscripción exitosa',
          description: 'Te has registrado como fiscal de mesa exitosamente.',
        });
        setFormData({
          name: '',
          dni: '',
          email: '',
          phone: '',
          locality: '',
          electoralSection: '',
          availability: 'full_day',
          comments: '',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error al registrarse',
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
            <CardTitle className="font-headline text-3xl text-accent">¡Registro de Fiscal Exitoso!</CardTitle>
            <CardDescription className="text-base">
              Gracias por comprometerte con la defensa de los votos de la libertad en Misiones. 
              Hemos recibido tus datos de inscripción y el equipo de fiscalización se pondrá en contacto contigo para las capacitaciones electorales.
            </CardDescription>
          </div>
          <Button 
            onClick={() => setSubmitted(false)}
            className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-300"
          >
            Inscribir a otra persona
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/90 border border-white/60 shadow-[0_25px_60px_-15px_rgba(139,31,164,0.1)] rounded-[2rem] backdrop-blur-lg w-full text-foreground p-2 md:p-6">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-accent text-center">Registro de Fiscales Electorales</CardTitle>
        <CardDescription className="text-center text-base">
          ¡Defendé la libertad en las urnas! Completa tus datos para sumarte al equipo de fiscales de mesa y de escuela del partido.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fi-name" className="text-foreground/80">Nombre Completo *</Label>
              <Input
                id="fi-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="María Laura González"
                className="bg-background/50 border-white/30 focus:border-primary/50 rounded-xl"
                disabled={isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fi-dni" className="text-foreground/80">Número de DNI (sin puntos) *</Label>
              <Input
                id="fi-dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="28123456"
                className="bg-background/50 border-white/30 focus:border-primary/50 rounded-xl"
                disabled={isPending}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fi-email" className="text-foreground/80">Correo Electrónico *</Label>
              <Input
                id="fi-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="maria@example.com"
                className="bg-background/50 border-white/30 focus:border-primary/50 rounded-xl"
                disabled={isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fi-phone" className="text-foreground/80">Celular / WhatsApp *</Label>
              <Input
                id="fi-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="3764998877"
                className="bg-background/50 border-white/30 focus:border-primary/50 rounded-xl"
                disabled={isPending}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fi-locality" className="text-foreground/80">Localidad de Votación *</Label>
              <Input
                id="fi-locality"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                placeholder="Eldorado"
                className="bg-background/50 border-white/30 focus:border-primary/50 rounded-xl"
                disabled={isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fi-section" className="text-foreground/80">Escuela / Sección Electoral de preferencia *</Label>
              <Input
                id="fi-section"
                name="electoralSection"
                value={formData.electoralSection}
                onChange={handleChange}
                placeholder="Escuela Normal Nº 11 o Circuito Electoral"
                className="bg-background/50 border-white/30 focus:border-primary/50 rounded-xl"
                disabled={isPending}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fi-availability" className="text-foreground/80">Disponibilidad Horaria *</Label>
              <Select value={formData.availability} onValueChange={handleSelectChange}>
                <SelectTrigger id="fi-availability" className="bg-background/50 border-white/30 focus:border-primary/50 rounded-xl">
                  <SelectValue placeholder="Selecciona disponibilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_day">Jornada Completa (07:30 a 18:30)</SelectItem>
                  <SelectItem value="morning">Turno Mañana (07:30 a 13:00)</SelectItem>
                  <SelectItem value="afternoon">Turno Tarde (13:00 a 18:30)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fi-comments" className="text-foreground/80">Comentarios o Experiencia Previa</Label>
              <Input
                id="fi-comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="He fiscalizado en las elecciones 2023 / Ninguna"
                className="bg-background/50 border-white/30 focus:border-primary/50 rounded-xl"
                disabled={isPending}
              />
            </div>
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
                  Inscribiendo...
                </span>
              ) : 'Quiero ser Fiscal Elector'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
