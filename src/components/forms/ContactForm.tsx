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

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
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
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        variant: 'destructive',
        title: 'Campos incompletos',
        description: 'Por favor, completa los campos requeridos (Nombre, Email y Mensaje).',
      });
      return;
    }

    startTransition(async () => {
      const result = await submitFormAction('contacto', formData);
      if (result.success) {
        setSubmitted(true);
        toast({
          title: 'Mensaje enviado',
          description: 'Recibimos tu consulta. Nos comunicaremos a la brevedad.',
        });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
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
            <CardTitle className="font-headline text-3xl text-accent">¡Mensaje Enviado!</CardTitle>
            <CardDescription className="text-base">
              Gracias por ponerte en contacto con nosotros. Tu mensaje ha sido registrado exitosamente.
            </CardDescription>
          </div>
          <Button 
            onClick={() => setSubmitted(false)}
            className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-300"
          >
            Enviar otro mensaje
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/90 border border-white/60 shadow-[0_25px_60px_-15px_rgba(139,31,164,0.1)] rounded-[2rem] backdrop-blur-lg w-full text-foreground">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-accent">Envíanos un Mensaje</CardTitle>
        <CardDescription>Envianos tu consulta, sugerencia o reclamo. Tu opinión es muy importante para nosotros.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name" className="text-foreground/80">Nombre Completo *</Label>
              <Input
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Juan Pérez"
                className="bg-background/50 border-white/30 focus:border-primary/50 rounded-xl"
                disabled={isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email" className="text-foreground/80">Correo Electrónico *</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="juan@email.com"
                className="bg-background/50 border-white/30 focus:border-primary/50 rounded-xl"
                disabled={isPending}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-phone" className="text-foreground/80">Teléfono / WhatsApp</Label>
              <Input
                id="contact-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+54 376 4123456"
                className="bg-background/50 border-white/30 focus:border-primary/50 rounded-xl"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-subject" className="text-foreground/80">Asunto</Label>
              <Input
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Consulta sobre afiliaciones"
                className="bg-background/50 border-white/30 focus:border-primary/50 rounded-xl"
                disabled={isPending}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-message" className="text-foreground/80">Mensaje *</Label>
            <Textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Escribe tu mensaje aquí..."
              rows={4}
              className="bg-background/50 border-white/30 focus:border-primary/50 rounded-xl resize-none"
              disabled={isPending}
              required
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
                  Enviando...
                </span>
              ) : 'Enviar Mensaje'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
