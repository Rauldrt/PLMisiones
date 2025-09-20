
'use client';
import { useState, useEffect, useTransition } from 'react';
import { getFooterContentAction, getSocialLinksAction } from '@/actions/data';
import { saveFooterContent, saveSocialLinks } from '@/actions/admin';
import type { FooterContent, SocialLink } from '@/lib/types';
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

export default function ManageFooterPage() {
  const [content, setContent] = useState<FooterContent | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingContent, startSavingContentTransition] = useTransition();
  const [isSavingLinks, startSavingLinksTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [footerData, socialData] = await Promise.all([
        getFooterContentAction(),
        getSocialLinksAction()
      ]);
      setContent(footerData);
      setSocialLinks(socialData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSaveContent = () => {
    if (!content) return;
    startSavingContentTransition(async () => {
      const result = await saveFooterContent(content);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar el contenido del footer.' });
      }
    });
  };
  
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

  const handleFieldChange = (field: keyof FooterContent, value: string) => {
    if (!content) return;
    setContent({ ...content, [field]: value });
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

  if (isLoading) return <p>Cargando...</p>;
  if (!content) return <p>No se pudo cargar el contenido del footer.</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Gestionar Pie de Página</h1>
        <p className="text-muted-foreground">Administra los textos y enlaces del pie de página del sitio.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contenido de Texto</CardTitle>
          <CardDescription>Edita los campos de texto y guarda los cambios.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="contactTitle">Título de Contacto</Label>
                    <Input id="contactTitle" value={content.contactTitle} onChange={e => handleFieldChange('contactTitle', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="contactDescription">Descripción de Contacto</Label>
                    <Input id="contactDescription" value={content.contactDescription} onChange={e => handleFieldChange('contactDescription', e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="headquartersTitle">Título Sede</Label>
                    <Input id="headquartersTitle" value={content.headquartersTitle} onChange={e => handleFieldChange('headquartersTitle', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input id="address" value={content.address} onChange={e => handleFieldChange('address', e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="contactInfoTitle">Título Email/Teléfono</Label>
                    <Input id="contactInfoTitle" value={content.contactInfoTitle} onChange={e => handleFieldChange('contactInfoTitle', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={content.email} onChange={e => handleFieldChange('email', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" value={content.phone} onChange={e => handleFieldChange('phone', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input id="whatsapp" value={content.whatsapp || ''} onChange={e => handleFieldChange('whatsapp', e.target.value)} placeholder="Ej: +5491122334455" />
                    <p className="text-xs text-muted-foreground">Incluir código de país, sin espacios ni símbolos.</p>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="socialsTitle">Título Redes Sociales</Label>
                    <Input id="socialsTitle" value={content.socialsTitle} onChange={e => handleFieldChange('socialsTitle', e.target.value)} />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="copyright">Texto de Copyright</Label>
                    <Input id="copyright" value={content.copyright} onChange={e => handleFieldChange('copyright', e.target.value)} />
                    <p className="text-xs text-muted-foreground">Usa {'{year}'} para mostrar el año actual.</p>
                </div>
                  <div className="space-y-2">
                    <Label htmlFor="credits">Texto de Créditos</Label>
                    <Input id="credits" value={content.credits} onChange={e => handleFieldChange('credits', e.target.value)} />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSaveContent} disabled={isSavingContent}>
                    {isSavingContent ? 'Guardando...' : 'Guardar Textos'}
                </Button>
            </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Redes Sociales</CardTitle>
          <CardDescription>Edita, agrega o elimina las URLs de los perfiles de redes sociales. El nombre debe coincidir con un icono de Lucide (ej. Facebook, Twitter, Instagram).</CardDescription>
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
                    </div>
                     <div className="flex-1 space-y-1">
                        <Label htmlFor={`social-url-${index}`}>URL</Label>
                        <Input id={`social-url-${index}`} value={link.url} onChange={(e) => handleLinkChange(index, 'url', e.target.value)} />
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon"><Icons.Trash className="w-4 h-4" /></Button>
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
    </div>
  );
}

