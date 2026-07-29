'use client';
import { useState, useTransition } from 'react';
import { saveSocialLinks } from '@/actions/admin';
import type { SocialLink } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Icons, IconName } from '@/components/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from 'next/link';

interface SocialLinksFormProps {
  initialSocialLinks: SocialLink[];
}

export function SocialLinksForm({ initialSocialLinks }: SocialLinksFormProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialSocialLinks);
  const [isSavingLinks, startSavingLinksTransition] = useTransition();
  const { toast } = useToast();

  const handleSaveLinks = () => {
    startSavingLinksTransition(async () => {
      const result = await saveSocialLinks(socialLinks);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron guardar los enlaces.' });
      }
    });
  };

  const handleLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...socialLinks];
    (newLinks[index] as any)[field] = value;
    setSocialLinks(newLinks);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { id: new Date().getTime().toString(), name: 'Facebook', url: 'https://' }]);
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id));
  };

  const getSocialIcon = (name: string) => {
    const Icon = Icons[name as IconName];
    return Icon ? <Icon className="h-6 w-6" /> : <Icons.Social className="h-6 w-6" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redes Sociales</CardTitle>
        <CardDescription>
          Administra los enlaces de tus redes. Para que el icono aparezca, el campo "Nombre del Icono" debe coincidir con un nombre de la librería de iconos Lucide (ej: Facebook, Twitter, Instagram, Youtube, Mail, etc.).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
          {socialLinks.map((link, index) => (
              <div key={link.id} className="flex items-end gap-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground pt-6">
                      {getSocialIcon(link.name)}
                  </div>
                  <div className="flex-1 space-y-1">
                      <Label htmlFor={`social-name-${index}`}>Nombre del Icono</Label>
                      <Input id={`social-name-${index}`} value={link.name} onChange={(e) => handleLinkChange(index, 'name', e.target.value)} placeholder="Ej: Youtube"/>
                      <p className="text-xs text-muted-foreground">
                          Buscar iconos en <Link href="https://lucide.dev/icons/" target="_blank" className="text-primary underline">lucide.dev/icons</Link>. Usar el nombre exacto (ej: "Mail").
                      </p>
                  </div>
                   <div className="flex-1 space-y-1">
                      <Label htmlFor={`social-url-${index}`}>URL</Label>
                      <Input id={`social-url-${index}`} value={link.url} onChange={(e) => handleLinkChange(index, 'url', e.target.value)} />
                  </div>
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" aria-label="Eliminar"><Icons.Trash className="w-4 h-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el enlace social.
                          </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeSocialLink(link.id)}>Eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
              </div>
          ))}
          <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={addSocialLink}><Icons.Plus className="mr-2 h-4 w-4"/> Agregar Enlace</Button>
              <Button onClick={handleSaveLinks} disabled={isSavingLinks}>
                  {isSavingLinks ? 'Guardando...' : 'Guardar Enlaces'}
              </Button>
          </div>
      </CardContent>
    </Card>
  );
}
