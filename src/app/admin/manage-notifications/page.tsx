'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
import { getNotificationAction, getNotificationsAction } from '@/actions/data';
import { saveNotification, saveNotificationsPage } from '@/actions/admin';
import type { Notification, NotificationItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem as UiAccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ImageGallery } from '@/components/ImageGallery';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const TAG_OPTIONS = ['Alerta', 'Evento', 'Institucional', 'Comunicado'];

// Formatting Helper Component (HTML Toolbar)
interface RichTextHelperProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  id: string;
}

function RichTextHelper({ value, onChange, placeholder, id }: RichTextHelperProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTag = (tagOpen: string, tagClose: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = tagOpen + selected + tagClose;

    onChange(text.substring(0, start) + replacement + text.substring(end));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selected.length);
    }, 0);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1 p-1 bg-muted/50 rounded-t-md border border-input border-b-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-bold"
          onClick={() => insertTag('<strong>', '</strong>')}
          title="Negrita"
        >
          B
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs italic"
          onClick={() => insertTag('<em>', '</em>')}
          title="Cursiva"
        >
          I
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-semibold"
          onClick={() => insertTag('<h3>', '</h3>')}
          title="Título H3"
        >
          H3
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={() => insertTag('<a href="#" target="_blank">', '</a>')}
          title="Enlace"
        >
          Enlace
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={() => insertTag('<p>', '</p>')}
          title="Párrafo"
        >
          Párrafo
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
          title="Lista"
        >
          Lista
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        id={id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-t-none rounded-b-md min-h-[140px] font-sans"
        rows={6}
      />
    </div>
  );
}

// Live Preview of the Feed Card
function NotificationCardPreview({ item }: { item: NotificationItem }) {
  const hasTextContent = item.title || item.content;
  return (
    <div className="border border-border/80 rounded-xl overflow-hidden bg-card text-card-foreground shadow-md max-w-sm w-full mx-auto animate-in fade-in duration-300">
      <div className="p-3 bg-muted/20 border-b flex justify-between items-center">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Vista Previa (Feed)</span>
        {item.tag && (
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border",
            item.tag === 'Alerta' && 'bg-red-500/10 text-red-500 border-red-500/20',
            item.tag === 'Evento' && 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            item.tag === 'Institucional' && 'bg-green-500/10 text-green-500 border-green-500/20',
            item.tag === 'Comunicado' && 'bg-purple-500/10 text-purple-500 border-purple-500/20',
          )}>
            {item.tag}
          </span>
        )}
      </div>
      {item.imageUrl && (
        <div className="relative h-44 w-full bg-muted overflow-hidden">
          <img src={item.imageUrl} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
      {hasTextContent && (
        <div className="p-4 space-y-2 text-left">
          <h4 className="font-headline font-bold text-base text-foreground leading-snug">{item.title || 'Título de Ejemplo'}</h4>
          <p className="text-[10px] text-muted-foreground">
            {item.date ? new Date(item.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) : 'Fecha'}
          </p>
          <div className="prose prose-xs prose-invert max-w-full text-xs text-muted-foreground mt-2 leading-relaxed max-h-[120px] overflow-y-auto" dangerouslySetInnerHTML={{ __html: item.content || 'Escribe contenido...' }} />
        </div>
      )}
    </div>
  );
}

// Glowing bubble preview
function GlowBubblePreview({ color, speed, text }: { color: 'orange' | 'blue' | 'green' | 'red'; speed: 'slow' | 'normal' | 'fast'; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted/10 relative overflow-hidden h-24 group transition-all hover:bg-muted/20">
      <span className="absolute top-2 left-2 text-[9px] font-bold text-muted-foreground uppercase">Glow Real-Time Preview</span>
      
      <div className={cn(
        "flex h-auto items-center justify-center rounded-full border bg-secondary py-1 px-3.5 text-secondary-foreground shadow-md transition-all duration-300",
        color === 'orange' && 'border-orange-500/50 shadow-orange-500/10',
        color === 'blue' && 'border-blue-500/50 shadow-blue-500/10',
        color === 'green' && 'border-green-500/50 shadow-green-500/10',
        color === 'red' && 'border-red-500/50 shadow-red-500/10',
      )}>
        <span className="relative mr-2 flex h-2 w-2">
          <span className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75",
            color === 'orange' && 'bg-orange-400',
            color === 'blue' && 'bg-blue-400',
            color === 'green' && 'bg-green-400',
            color === 'red' && 'bg-red-400',
            speed === 'slow' && 'animate-ping-slow',
            speed === 'normal' && 'animate-ping',
            speed === 'fast' && 'animate-ping-fast',
          )}></span>
          <span className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            color === 'orange' && 'bg-orange-500',
            color === 'blue' && 'bg-blue-500',
            color === 'green' && 'bg-green-500',
            color === 'red' && 'bg-red-500',
          )}></span>
        </span>
        <span className="text-xs font-semibold">{text || 'Notificación'}</span>
      </div>
    </div>
  );
}

export default function UnifiedNotificationsPage() {
  const [bubbleConfig, setBubbleConfig] = useState<Notification | null>(null);
  const [feedItems, setFeedItems] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();
  
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // -1 targets bubble, >=0 targets feedItems

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [bubble, feed] = await Promise.all([
          getNotificationAction(),
          getNotificationsAction()
        ]);
        setBubbleConfig(bubble);
        setFeedItems(feed);
      } catch (err) {
        console.error("Failed to load notifications data:", err);
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar los datos.' });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const saveFeed = (itemsToSave: NotificationItem[]) => {
    startSavingTransition(async () => {
      const result = await saveNotificationsPage(itemsToSave);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar la lista de notificaciones.' });
      }
    });
  };

  const saveBubble = () => {
    if (!bubbleConfig) return;
    startSavingTransition(async () => {
      const result = await saveNotification(bubbleConfig);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar la configuración de la burbuja.' });
      }
    });
  };

  // Handlers for bubble config
  const handleBubbleFieldChange = (field: keyof Notification, value: string | boolean) => {
    if (!bubbleConfig) return;
    setBubbleConfig({ ...bubbleConfig, [field]: value });
  };

  // Handlers for feed items
  const handleFeedFieldChange = (index: number, field: keyof NotificationItem, value: string | boolean) => {
    const newItems = [...feedItems];
    (newItems[index] as any)[field] = value;
    setFeedItems(newItems);
  };

  const handleToggleHidden = (id: string, isHidden: boolean) => {
    const updated = feedItems.map(item => 
      item.id === id ? { ...item, hidden: isHidden } : item
    );
    setFeedItems(updated);
    saveFeed(updated);
  };

  const addFeedItem = () => {
    const newItem: NotificationItem = {
      id: new Date().getTime().toString(),
      title: 'Nueva Notificación',
      content: 'Escribe aquí la descripción...',
      date: new Date().toISOString().split('T')[0],
      imageUrl: '',
      imageHint: '',
      hidden: false,
      tag: 'Comunicado'
    };
    setFeedItems([newItem, ...feedItems]);
  };

  const removeFeedItem = (id: string) => {
    const newItems = feedItems.filter(item => item.id !== id);
    setFeedItems(newItems);
    saveFeed(newItems);
  };

  const moveFeedItem = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === feedItems.length - 1)) {
      return;
    }
    const newItems = [...feedItems];
    const item = newItems.splice(index, 1)[0];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    newItems.splice(newIndex, 0, item);
    setFeedItems(newItems);
  };

  const handleImageSelect = (imageUrl: string) => {
    if (editingIndex === -1) {
      handleBubbleFieldChange('imageUrl', imageUrl);
    } else if (editingIndex !== null && editingIndex >= 0) {
      handleFeedFieldChange(editingIndex, 'imageUrl', imageUrl);
    }
    setGalleryOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2 font-medium">Cargando módulo de notificaciones...</span>
      </div>
    );
  }

  return (
    <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gestión de Notificaciones</h1>
          <p className="text-muted-foreground">Administra los anuncios del feed general y configura la burbuja flotante del home.</p>
        </div>

        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[500px] mb-8 bg-muted/30 border p-1 rounded-lg">
            <TabsTrigger value="feed">Feed de Notificaciones (Historial)</TabsTrigger>
            <TabsTrigger value="bubble">Burbuja Flotante (Página de Inicio)</TabsTrigger>
          </TabsList>

          {/* TAB 1: NOTIFICATIONS FEED */}
          <TabsContent value="feed" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Historial de Notificaciones</CardTitle>
                  <CardDescription>
                    Administra los anuncios que los usuarios pueden leer en la sección de notificaciones.
                  </CardDescription>
                </div>
                <Button onClick={addFeedItem}>
                  <Icons.Plus className="mr-2 h-4 w-4" /> Nueva Notificación
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedItems.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icons.Inbox className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p>No hay notificaciones cargadas. Crea una nueva.</p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {feedItems.map((item, index) => (
                      <UiAccordionItem key={item.id} value={item.id} className="border rounded-lg mb-3 px-4 bg-muted/5 overflow-hidden">
                        <div className="flex justify-between items-center w-full pr-2">
                          <AccordionTrigger className="hover:no-underline flex-1 text-left py-4">
                            <div className="flex items-center gap-4">
                              {item.imageUrl && (
                                <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded object-cover border" />
                              )}
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-sm sm:text-base">{item.title}</span>
                                  {item.tag && (
                                    <span className={cn(
                                      "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                                      item.tag === 'Alerta' && 'bg-red-500/10 text-red-500 border-red-500/20',
                                      item.tag === 'Evento' && 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                                      item.tag === 'Institucional' && 'bg-green-500/10 text-green-500 border-green-500/20',
                                      item.tag === 'Comunicado' && 'bg-purple-500/10 text-purple-500 border-purple-500/20',
                                    )}>
                                      {item.tag}
                                    </span>
                                  )}
                                  {item.hidden && (
                                    <span className="px-1.5 py-0.5 rounded bg-muted-foreground/15 text-muted-foreground border border-muted-foreground/20 text-[9px] font-bold uppercase">
                                      Oculto
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <div className="flex items-center gap-1.5 z-10" onClick={e => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleHidden(item.id, !item.hidden)} title={item.hidden ? "Mostrar" : "Ocultar"}>
                              {item.hidden ? <Icons.View className="h-4 w-4" /> : <Icons.Hide className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveFeedItem(index, 'up')} disabled={index === 0}>
                              <Icons.ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveFeedItem(index, 'down')} disabled={index === feedItems.length - 1}>
                              <Icons.ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeFeedItem(item.id)}>
                              <Icons.Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <AccordionContent className="pt-2 pb-6 border-t space-y-4">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Editor fields */}
                            <div className="lg:col-span-2 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <Label htmlFor={`title-${index}`}>Título</Label>
                                  <Input
                                    id={`title-${index}`}
                                    value={item.title}
                                    onChange={e => handleFeedFieldChange(index, 'title', e.target.value)}
                                    placeholder="Ej: Nuevo encuentro local"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor={`date-${index}`}>Fecha</Label>
                                  <Input
                                    id={`date-${index}`}
                                    type="date"
                                    value={item.date}
                                    onChange={e => handleFeedFieldChange(index, 'date', e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <Label>Categoría / Tag</Label>
                                  <Select
                                    value={item.tag || 'Comunicado'}
                                    onValueChange={v => handleFeedFieldChange(index, 'tag', v)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecciona un tag" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {TAG_OPTIONS.map(opt => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor={`imageUrl-${index}`}>Imagen del Anuncio</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      id={`imageUrl-${index}`}
                                      value={item.imageUrl || ''}
                                      onChange={e => handleFeedFieldChange(index, 'imageUrl', e.target.value)}
                                      placeholder="Ruta local o URL de imagen"
                                    />
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="icon" onClick={() => setEditingIndex(index)} title="Buscar en galería o subir">
                                        <Icons.Gallery className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-start-2">
                                  <Label htmlFor={`imageHint-${index}`}>Pista de la Imagen (para IA)</Label>
                                  <Input
                                    id={`imageHint-${index}`}
                                    value={item.imageHint || ''}
                                    onChange={e => handleFeedFieldChange(index, 'imageHint', e.target.value)}
                                    placeholder="Ej: meeting room"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor={`content-${index}`}>Contenido del Anuncio (Formato HTML)</Label>
                                <RichTextHelper
                                  id={`content-${index}`}
                                  value={item.content}
                                  onChange={v => handleFeedFieldChange(index, 'content', v)}
                                  placeholder="Escribe el contenido de la notificación..."
                                />
                              </div>
                            </div>

                            {/* Live preview */}
                            <div className="flex items-center justify-center">
                              <NotificationCardPreview item={item} />
                            </div>

                          </div>

                          <div className="flex justify-end pt-4 border-t">
                            <Button onClick={() => saveFeed(feedItems)} disabled={isSaving}>
                              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                          </div>
                        </AccordionContent>
                      </UiAccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: FLOATING BUBBLE CONFIG */}
          <TabsContent value="bubble">
            {bubbleConfig && (
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de la Burbuja del Home</CardTitle>
                  <CardDescription>
                    Administra el estado, texto y los destellos animados de la notificación flotante del sitio principal.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Controls */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/10">
                        <div className="space-y-0.5">
                          <Label className="text-base font-semibold">Habilitar Burbuja</Label>
                          <p className="text-xs text-muted-foreground">Determina si se muestra la burbuja en la esquina del sitio.</p>
                        </div>
                        <Switch
                          checked={bubbleConfig.enabled}
                          onCheckedChange={c => handleBubbleFieldChange('enabled', c)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="bubble-text">Texto de la Burbuja</Label>
                          <Input
                            id="bubble-text"
                            value={bubbleConfig.text}
                            onChange={e => handleBubbleFieldChange('text', e.target.value)}
                            placeholder="Ej: ¡Nuevo Evento!"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="bubble-link">Enlace de Desvío (Opcional)</Label>
                          <Input
                            id="bubble-link"
                            value={bubbleConfig.link || ''}
                            onChange={e => handleBubbleFieldChange('link', e.target.value)}
                            placeholder="Ej: /notificaciones"
                          />
                          <p className="text-[10px] text-muted-foreground">Si está vacío, la burbuja abrirá un cuadro de diálogo.</p>
                        </div>
                      </div>

                      {/* Visual glow picker */}
                      <div className="space-y-3">
                        <Label>Estilo y Destello del Botón</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Color del Destello</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {(['orange', 'blue', 'green', 'red'] as const).map(c => (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => handleBubbleFieldChange('glowColor', c)}
                                  className={cn(
                                    "flex items-center gap-2 p-2 border rounded-md text-xs font-medium justify-center transition-all",
                                    bubbleConfig.glowColor === c 
                                      ? "border-primary bg-primary/10 ring-2 ring-primary/20" 
                                      : "border-border hover:bg-muted/40"
                                  )}
                                >
                                  <span className={cn(
                                    "h-3 w-3 rounded-full",
                                    c === 'orange' && 'bg-orange-500',
                                    c === 'blue' && 'bg-blue-500',
                                    c === 'green' && 'bg-green-500',
                                    c === 'red' && 'bg-red-500',
                                  )} />
                                  <span className="capitalize">{c === 'orange' ? 'Naranja' : c === 'blue' ? 'Azul' : c === 'green' ? 'Verde' : 'Rojo'}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">Velocidad del Destello</Label>
                            <div className="grid grid-cols-3 gap-2">
                              {(['slow', 'normal', 'fast'] as const).map(s => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => handleBubbleFieldChange('glowSpeed', s)}
                                  className={cn(
                                    "p-2 border rounded-md text-xs font-medium justify-center transition-all capitalize",
                                    bubbleConfig.glowSpeed === s 
                                      ? "border-primary bg-primary/10 ring-2 ring-primary/20" 
                                      : "border-border hover:bg-muted/40"
                                  )}
                                >
                                  {s === 'slow' ? 'Lento' : s === 'normal' ? 'Medio' : 'Rápido'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Modal configuration */}
                      <div className="border p-4 rounded-lg space-y-4 bg-muted/5">
                        <Label className="font-bold text-sm">Configuración del Popup (Si no tiene enlace)</Label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label htmlFor="bubble-title">Título del Popup</Label>
                            <Input
                              id="bubble-title"
                              value={bubbleConfig.title || ''}
                              onChange={e => handleBubbleFieldChange('title', e.target.value)}
                              placeholder="Título del popup modal"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="bubble-imageUrl">Imagen del Popup</Label>
                            <div className="flex gap-2">
                              <Input
                                id="bubble-imageUrl"
                                value={bubbleConfig.imageUrl || ''}
                                onChange={e => handleBubbleFieldChange('imageUrl', e.target.value)}
                                placeholder="Ruta de imagen"
                              />
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => setEditingIndex(-1)} title="Buscar en galería o subir">
                                  <Icons.Gallery className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1 md:col-start-2">
                            <Label htmlFor="bubble-imageHint">Pista de Imagen (para IA)</Label>
                            <Input
                              id="bubble-imageHint"
                              value={bubbleConfig.imageHint || ''}
                              onChange={e => handleBubbleFieldChange('imageHint', e.target.value)}
                              placeholder="Ej: handshake"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="bubble-content">Cuerpo del Popup (HTML)</Label>
                          <RichTextHelper
                            id="bubble-content"
                            value={bubbleConfig.content}
                            onChange={v => handleBubbleFieldChange('content', v)}
                            placeholder="Escribe el cuerpo detallado..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="flex flex-col gap-6">
                      <GlowBubblePreview
                        color={bubbleConfig.glowColor || 'orange'}
                        speed={bubbleConfig.glowSpeed || 'normal'}
                        text={bubbleConfig.text}
                      />
                      
                      <div className="border border-border/80 rounded-xl overflow-hidden bg-card text-card-foreground shadow-md max-w-sm w-full mx-auto">
                        <div className="p-3 bg-muted/20 border-b">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Vista Previa Popup (Home)</span>
                        </div>
                        {bubbleConfig.imageUrl && (
                          <div className="relative h-44 w-full bg-muted overflow-hidden">
                            <img src={bubbleConfig.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-4 space-y-2 text-left">
                          <h4 className="font-headline font-bold text-base text-foreground leading-snug">{bubbleConfig.title || 'Título del Popup'}</h4>
                          <div className="prose prose-xs prose-invert max-w-full text-xs text-muted-foreground mt-2 leading-relaxed max-h-[120px] overflow-y-auto" dangerouslySetInnerHTML={{ __html: bubbleConfig.content || 'Escribe contenido...' }} />
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button onClick={saveBubble} disabled={isSaving}>
                      {isSaving ? 'Guardando...' : 'Guardar Configuración'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Seleccionar Imagen de la Galería</DialogTitle>
        </DialogHeader>
        <ImageGallery onImageSelect={handleImageSelect} />
      </DialogContent>
    </Dialog>
  );
}
