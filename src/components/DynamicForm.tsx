'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { FormDefinition } from '@/lib/types';
import { buildZodSchema } from '@/lib/zod-schema-builder';
import { handleFormSubmission } from '@/actions/form';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition } from 'react';

interface DynamicFormProps {
  formDefinition: FormDefinition;
}

export function DynamicForm({ formDefinition }: DynamicFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const formSchema = buildZodSchema(formDefinition);
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefinition.fields.reduce((acc, field) => {
        acc[field.name as keyof FormValues] = '' as any;
        return acc;
    }, {} as Partial<FormValues>),
  });

  async function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await handleFormSubmission(formDefinition.name, values);
      if (result.success) {
        toast({
          title: '¡Éxito!',
          description: 'Tu formulario ha sido enviado correctamente.',
        });
        form.reset();
        setFormSubmitted(true);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'No se pudo enviar el formulario.',
        });
      }
    });
  }

  if (formSubmitted) {
    return (
        <Card className="bg-card border-border">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl text-accent">{formDefinition.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-lg">¡Gracias por tu mensaje!</p>
                <p className="text-foreground/80 mt-2">Hemos recibido tu formulario y nos pondremos en contacto si es necesario.</p>
                <Button onClick={() => setFormSubmitted(false)} className="mt-6">Enviar otro formulario</Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-accent">{formDefinition.title}</CardTitle>
        <CardDescription>{formDefinition.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formDefinition.fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name as keyof FormValues}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.type === 'textarea' ? (
                        <Textarea placeholder={field.placeholder} {...formField} />
                      ) : (
                        <Input type={field.type} placeholder={field.placeholder} {...formField} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Enviando...' : 'Enviar'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
