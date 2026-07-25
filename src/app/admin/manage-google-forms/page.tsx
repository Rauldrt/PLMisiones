'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { getGoogleFormsAction } from '@/actions/data';
import { saveGoogleForms } from '@/actions/admin';
import { getWhatsappConfigAction, saveWhatsappConfigAction, getGreenApiQrAction, getGreenApiStatusAction } from '@/actions/submissions';
import type { GoogleForm, FormField, WhatsappConfig } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

export default function ManageGoogleFormsPage() {
  // Tabs state
  const [activeTab, setActiveTab] = useState<'forms' | 'whatsapp'>('forms');

  // Forms state
  const [forms, setForms] = useState<GoogleForm[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState(true);
  const [isSavingForms, startSavingFormsTransition] = useTransition();

  // WhatsApp config state
  const [waConfig, setWaConfig] = useState<WhatsappConfig>({
    enabled: false,
    provider: 'callmebot',
    apiKey: '',
    numbers: '',
    webhookUrl: '',
  });
  const [isLoadingWa, setIsLoadingWa] = useState(true);
  const [isSavingWa, startSavingWaTransition] = useTransition();

  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      setIsLoadingForms(true);
      setIsLoadingWa(true);
      try {
        const formsData = await getGoogleFormsAction();
        setForms(formsData);
        
        const waData = await getWhatsappConfigAction();
        if (waData) {
          setWaConfig(waData);
        }
      } catch (err) {
        console.error("Failed to load configs:", err);
      } finally {
        setIsLoadingForms(false);
        setIsLoadingWa(false);
      }
    }
    loadData();
  }, []);

  // ----------------------------------------------------
  // Forms Handlers
  // ----------------------------------------------------
  const handleSaveForms = () => {
    startSavingFormsTransition(async () => {
      const result = await saveGoogleForms(forms);
      if (result.success) {
        toast({ title: 'Éxito', description: 'Estructura de formularios guardada correctamente.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron guardar los formularios.' });
      }
    });
  };

  const handleFormPropChange = (formIndex: number, prop: keyof GoogleForm, value: string) => {
    const newForms = [...forms];
    (newForms[formIndex] as any)[prop] = value;
    setForms(newForms);
  };

  const handleFieldPropChange = (formIndex: number, fieldIndex: number, prop: keyof FormField, value: any) => {
    const newForms = [...forms];
    if (newForms[formIndex].fields) {
      newForms[formIndex].fields![fieldIndex] = {
        ...newForms[formIndex].fields![fieldIndex],
        [prop]: value,
      };
    }
    setForms(newForms);
  };

  const handleAddField = (formIndex: number) => {
    const newForms = [...forms];
    if (!newForms[formIndex].fields) {
      newForms[formIndex].fields = [];
    }
    
    const newId = `campo_${Date.now().toString().slice(-4)}`;
    newForms[formIndex].fields!.push({
      id: newId,
      label: 'Nuevo Campo',
      type: 'text',
      required: false,
      placeholder: '',
    });
    setForms(newForms);
    toast({ title: 'Campo añadido', description: 'Se añadió un nuevo campo al final del formulario.' });
  };

  const handleRemoveField = (formIndex: number, fieldIndex: number) => {
    const newForms = [...forms];
    if (newForms[formIndex].fields) {
      newForms[formIndex].fields = newForms[formIndex].fields!.filter((_, idx) => idx !== fieldIndex);
    }
    setForms(newForms);
    toast({ title: 'Campo eliminado', description: 'El campo fue removido del formulario.' });
  };

  const handleMoveField = (formIndex: number, fieldIndex: number, direction: 'up' | 'down') => {
    const newForms = [...forms];
    const fields = [...(newForms[formIndex].fields || [])];
    
    if (direction === 'up' && fieldIndex > 0) {
      [fields[fieldIndex], fields[fieldIndex - 1]] = [fields[fieldIndex - 1], fields[fieldIndex]];
    } else if (direction === 'down' && fieldIndex < fields.length - 1) {
      [fields[fieldIndex], fields[fieldIndex + 1]] = [fields[fieldIndex + 1], fields[fieldIndex]];
    }
    
    newForms[formIndex].fields = fields;
    setForms(newForms);
  };

  // ----------------------------------------------------
  // Green-API connection state
  // ----------------------------------------------------
  const [greenQr, setGreenQr] = useState<string | null>(null);
  const [greenStatus, setGreenStatus] = useState<string | null>(null);
  const [checkingGreen, setCheckingGreen] = useState(false);

  const handleCheckGreenApi = async () => {
    if (!waConfig.greenApiInstanceId || !waConfig.greenApiToken) {
      toast({
        variant: 'destructive',
        title: 'Faltan credenciales',
        description: 'Por favor ingresa el ID de Instancia y el Token de Green-API.',
      });
      return;
    }
    setCheckingGreen(true);
    setGreenQr(null);
    setGreenStatus(null);
    try {
      const statusRes = await getGreenApiStatusAction(waConfig.greenApiInstanceId, waConfig.greenApiToken);
      if (statusRes.success && statusRes.data) {
        const state = statusRes.data.stateInstance;
        setGreenStatus(state);
        
        if (state !== 'authorized') {
          const qrRes = await getGreenApiQrAction(waConfig.greenApiInstanceId, waConfig.greenApiToken);
          if (qrRes.success && qrRes.data) {
            if (qrRes.data.type === 'qr') {
              setGreenQr(qrRes.data.message);
            } else if (qrRes.data.type === 'alreadyLogged') {
              setGreenStatus('authorized');
            }
          }
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error de conexión',
          description: statusRes.message || 'No se pudo conectar con Green-API.',
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error inesperado al conectar con Green-API.',
      });
    } finally {
      setCheckingGreen(false);
    }
  };

  // ----------------------------------------------------
  // WhatsApp Handlers
  // ----------------------------------------------------
  const handleSaveWaConfig = () => {
    startSavingWaTransition(async () => {
      const result = await saveWhatsappConfigAction(waConfig);
      if (result.success) {
        toast({ title: 'Éxito', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar la configuración de WhatsApp.' });
      }
    });
  };

  const handleWaPropChange = (prop: keyof WhatsappConfig, value: any) => {
    setWaConfig({
      ...waConfig,
      [prop]: value,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Configuración de Formularios y Alertas</h1>
        <p className="text-muted-foreground">Administra los campos dinámicos de los formularios y configura notificaciones por WhatsApp.</p>
      </div>

      <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="forms" className="rounded-lg font-medium px-6">
            <Icons.Forms className="h-4 w-4 mr-2" /> Campos de Formularios
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="rounded-lg font-medium px-6">
            <Icons.Whatsapp className="h-4 w-4 mr-2 text-green-500" /> Alertas de WhatsApp
          </TabsTrigger>
        </TabsList>

        {/* ----------------------------------------------------
            TAB: FORM FIELDS EDITOR
            ---------------------------------------------------- */}
        <TabsContent value="forms" className="mt-6 space-y-4">
          <Card className="border shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Editor de Formularios</CardTitle>
              <CardDescription>Personaliza los campos de contacto, pre-afiliación y fiscales.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingForms ? (
                <div className="flex items-center justify-center py-12">
                  <span className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mr-2" />
                  Cargando estructura...
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full" defaultValue={forms[0]?.id}>
                  {forms.map((form, formIndex) => (
                    <AccordionItem key={form.id} value={form.id} className="border-b last:border-b-0">
                      <AccordionTrigger className="hover:no-underline font-headline font-semibold text-lg py-4">
                        <span className="capitalize">{form.title || `Formulario ${form.id}`}</span>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 border-t space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label htmlFor={`title-${formIndex}`}>Título del Formulario</Label>
                            <Input 
                              id={`title-${formIndex}`} 
                              value={form.title} 
                              onChange={e => handleFormPropChange(formIndex, 'title', e.target.value)} 
                              className="rounded-xl bg-background/50"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`desc-${formIndex}`}>Descripción / Ayuda</Label>
                            <Input 
                              id={`desc-${formIndex}`} 
                              value={form.description || ''} 
                              onChange={e => handleFormPropChange(formIndex, 'description', e.target.value)} 
                              className="rounded-xl bg-background/50"
                            />
                          </div>
                        </div>

                        <div className="space-y-4 border-t pt-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-headline font-semibold text-base text-accent">Campos Registrados</h3>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleAddField(formIndex)} 
                              className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                            >
                              <Icons.Plus className="w-4 h-4 mr-2" /> Añadir Campo
                            </Button>
                          </div>

                          <div className="space-y-4">
                            {form.fields?.map((field, fieldIndex) => (
                              <Card key={field.id} className="bg-muted/30 border border-border/60 rounded-2xl relative overflow-hidden">
                                <CardContent className="p-4 space-y-4">
                                  {/* Field Header Actions */}
                                  <div className="flex items-center justify-between border-b pb-2">
                                    <span className="text-xs font-mono text-muted-foreground uppercase">
                                      ID: {field.id}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 rounded-lg"
                                        disabled={fieldIndex === 0}
                                        onClick={() => handleMoveField(formIndex, fieldIndex, 'up')}
                                        title="Subir"
                                      >
                                        <Icons.ChevronUp className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 rounded-lg"
                                        disabled={fieldIndex === (form.fields?.length || 0) - 1}
                                        onClick={() => handleMoveField(formIndex, fieldIndex, 'down')}
                                        title="Bajar"
                                      >
                                        <Icons.ChevronDown className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg ml-2"
                                        onClick={() => handleRemoveField(formIndex, fieldIndex)}
                                        title="Eliminar Campo"
                                      >
                                        <Icons.Trash className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Field Inputs Grid */}
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm">
                                    <div className="md:col-span-3 space-y-1">
                                      <Label className="text-xs">Clave única (ID / Slug)</Label>
                                      <Input
                                        value={field.id}
                                        onChange={(e) => handleFieldPropChange(formIndex, fieldIndex, 'id', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                        className="h-9 rounded-lg bg-background"
                                        placeholder="ej: edad"
                                      />
                                    </div>
                                    <div className="md:col-span-4 space-y-1">
                                      <Label className="text-xs">Etiqueta (Label visible)</Label>
                                      <Input
                                        value={field.label}
                                        onChange={(e) => handleFieldPropChange(formIndex, fieldIndex, 'label', e.target.value)}
                                        className="h-9 rounded-lg bg-background"
                                        placeholder="ej: Edad del solicitante"
                                      />
                                    </div>
                                    <div className="md:col-span-3 space-y-1">
                                      <Label className="text-xs">Tipo de Entrada</Label>
                                      <Select
                                        value={field.type}
                                        onValueChange={(val: any) => handleFieldPropChange(formIndex, fieldIndex, 'type', val)}
                                      >
                                        <SelectTrigger className="h-9 rounded-lg bg-background">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="text">Texto Corto</SelectItem>
                                          <SelectItem value="number">Número</SelectItem>
                                          <SelectItem value="email">Email</SelectItem>
                                          <SelectItem value="textarea">Texto Largo (Área)</SelectItem>
                                          <SelectItem value="select">Selección (Desplegable)</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="md:col-span-2 flex flex-col justify-center items-start pt-4">
                                      <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <input
                                          type="checkbox"
                                          checked={field.required}
                                          onChange={(e) => handleFieldPropChange(formIndex, fieldIndex, 'required', e.target.checked)}
                                          className="h-4 w-4 rounded border-gray-300 text-primary accent-primary"
                                        />
                                        <span className="text-xs font-medium">Requerido</span>
                                      </label>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm">
                                    <div className="md:col-span-6 space-y-1">
                                      <Label className="text-xs">Sugerencia (Placeholder / Ejemplo)</Label>
                                      <Input
                                        value={field.placeholder || ''}
                                        onChange={(e) => handleFieldPropChange(formIndex, fieldIndex, 'placeholder', e.target.value)}
                                        className="h-9 rounded-lg bg-background"
                                        placeholder="ej: Escribe tu edad..."
                                      />
                                    </div>
                                    {field.type === 'select' && (
                                      <div className="md:col-span-6 space-y-1">
                                        <Label className="text-xs">Opciones del Desplegable (separadas por comas)</Label>
                                        <Input
                                          value={field.options?.join(', ') || ''}
                                          onChange={(e) => handleFieldPropChange(formIndex, fieldIndex, 'options', e.target.value.split(',').map(o => o.trim()).filter(Boolean))}
                                          className="h-9 rounded-lg bg-background"
                                          placeholder="ej: Jornada Completa, Turno Mañana, Turno Tarde"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            {(!form.fields || form.fields.length === 0) && (
                              <div className="text-center py-6 text-muted-foreground text-sm border-2 border-dashed rounded-xl">
                                No hay campos configurados para este formulario. Haz clic en "Añadir Campo".
                              </div>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}

              <div className="flex justify-end items-center border-t pt-4">
                <Button onClick={handleSaveForms} disabled={isSavingForms} className="rounded-full px-6">
                  {isSavingForms ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Guardando Estructura...
                    </span>
                  ) : 'Guardar Todos los Formularios'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ----------------------------------------------------
            TAB: WHATSAPP NOTIFICATIONS CONFIG
            ---------------------------------------------------- */}
        <TabsContent value="whatsapp" className="mt-6">
          <Card className="border shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 font-headline">
                <Icons.Whatsapp className="w-6 h-6" /> Configuración de Alertas por WhatsApp
              </CardTitle>
              <CardDescription>
                Recibe notificaciones inmediatas cada vez que un usuario envíe un formulario.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingWa ? (
                <div className="flex items-center justify-center py-12">
                  <span className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mr-2" />
                  Cargando credenciales...
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Enabled Toggle Switch */}
                  <div className="flex items-center justify-between bg-muted/30 p-4 border rounded-xl">
                    <div className="space-y-0.5">
                      <Label htmlFor="wa-enabled" className="text-base font-semibold cursor-pointer">Habilitar Notificaciones</Label>
                      <p className="text-xs text-muted-foreground">Activa el reenvío de nuevos ingresos a WhatsApp.</p>
                    </div>
                    <input
                      id="wa-enabled"
                      type="checkbox"
                      checked={waConfig.enabled}
                      onChange={(e) => handleWaPropChange('enabled', e.target.checked)}
                      className="h-6 w-11 rounded-full border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer accent-green-600 scale-125"
                    />
                  </div>

                  {waConfig.enabled && (
                    <div className="space-y-6 border-t pt-4">
                      {/* Provider Select */}
                      <div className="space-y-2">
                        <Label htmlFor="wa-provider">Proveedor de Notificaciones</Label>
                        <Select
                          value={waConfig.provider}
                          onValueChange={(val: any) => handleWaPropChange('provider', val)}
                        >
                          <SelectTrigger id="wa-provider" className="rounded-xl bg-background/50">
                            <SelectValue placeholder="Seleccionar proveedor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="callmebot">WhatsApp vía CallMeBot (Gratuito / Una vía)</SelectItem>
                            <SelectItem value="telegram">Telegram Bot (Recomendado - 100% Gratis e Instantáneo)</SelectItem>
                            <SelectItem value="discord">Discord Webhook (Gratis y Simple)</SelectItem>
                            <SelectItem value="webhook">Webhook Genérico (POST JSON)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Conditional Fields based on Provider */}
                      {waConfig.provider === 'callmebot' && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="wa-numbers">Números de Teléfono de Destino (separados por comas)</Label>
                            <Input
                              id="wa-numbers"
                              value={waConfig.numbers || ''}
                              onChange={(e) => handleWaPropChange('numbers', e.target.value)}
                              placeholder="ej: +5493764123456, +5493764987654"
                              className="rounded-xl bg-background/50"
                            />
                            <p className="text-xs text-muted-foreground">
                              Ingresa los números telefónicos en formato internacional (código de país y de área). Varios separados por coma.
                            </p>
                          </div>
                          <div className="space-y-4 bg-muted/40 p-4 border rounded-2xl">
                            <div className="space-y-2">
                              <Label htmlFor="wa-apikey">CallMeBot API Key</Label>
                              <Input
                                id="wa-apikey"
                                value={waConfig.apiKey || ''}
                                onChange={(e) => handleWaPropChange('apiKey', e.target.value)}
                                placeholder="Ej: 123456"
                                className="rounded-xl bg-background"
                              />
                            </div>
                            <div className="text-xs text-muted-foreground space-y-2">
                              <p className="font-semibold text-foreground">💡 ¿Cómo obtener tu API Key de CallMeBot?</p>
                              <ol className="list-decimal pl-4 space-y-1">
                                <li>Agrega el número <span className="font-semibold text-green-600">+34 644 20 22 84</span> a tus contactos.</li>
                                <li>Envía un mensaje de WhatsApp: <span className="font-mono bg-muted px-1 py-0.5 rounded border">I allow callmebot to send me messages</span></li>
                                <li>El bot te enviará la clave en segundos.</li>
                              </ol>
                            </div>
                          </div>
                        </>
                      )}

                      {waConfig.provider === 'telegram' && (
                        <div className="space-y-4 bg-muted/40 p-4 border rounded-2xl">
                          <div className="space-y-2">
                            <Label htmlFor="tg-token">Token del Bot de Telegram</Label>
                            <Input
                              id="tg-token"
                              value={waConfig.telegramToken || ''}
                              onChange={(e) => handleWaPropChange('telegramToken', e.target.value)}
                              placeholder="Ej: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                              className="rounded-xl bg-background"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tg-chatid">Chat ID o ID de Grupo</Label>
                            <Input
                              id="tg-chatid"
                              value={waConfig.telegramChatId || ''}
                              onChange={(e) => handleWaPropChange('telegramChatId', e.target.value)}
                              placeholder="Ej: 987654321 o -1001234567890"
                              className="rounded-xl bg-background"
                            />
                          </div>
                          <div className="text-xs text-muted-foreground space-y-2">
                            <p className="font-semibold text-foreground">💡 ¿Cómo configurar tu Bot de Telegram en 60 segundos?</p>
                            <ol className="list-decimal pl-4 space-y-1">
                              <li>Busca a <span className="font-semibold text-blue-600">@BotFather</span> en Telegram y envía <span className="font-mono bg-muted px-1 rounded">/newbot</span>. Sigue los pasos para obtener el **Token**.</li>
                              <li>Inicia el bot enviándole un mensaje privado haciendo clic en su enlace (ej: `t.me/TuBot`).</li>
                              <li>Para obtener tu **Chat ID**, busca al usuario <span className="font-semibold text-blue-600">@userinfobot</span> en Telegram y envíale un mensaje. Te devolverá tu ID personal al instante.</li>
                              <li>Si deseas recibir alertas en un **Grupo**, añade el bot al grupo, dale permisos de administrador, y obtén el ID del grupo (suele empezar con `-100`).</li>
                            </ol>
                          </div>
                        </div>
                      )}

                      {waConfig.provider === 'discord' && (
                        <div className="space-y-4 bg-muted/40 p-4 border rounded-2xl">
                          <div className="space-y-2">
                            <Label htmlFor="dc-webhook">URL del Webhook de Discord</Label>
                            <Input
                              id="dc-webhook"
                              value={waConfig.webhookUrl || ''}
                              onChange={(e) => handleWaPropChange('webhookUrl', e.target.value)}
                              placeholder="https://discord.com/api/webhooks/..."
                              className="rounded-xl bg-background"
                            />
                          </div>
                          <div className="text-xs text-muted-foreground space-y-2">
                            <p className="font-semibold text-foreground">💡 ¿Cómo configurar un Webhook de Discord?</p>
                            <ol className="list-decimal pl-4 space-y-1">
                              <li>En tu servidor de Discord, haz clic derecho en el canal de texto elegido -{"&gt;"} **Editar Canal**.</li>
                              <li>Ve a **Integraciones** -{"&gt;"} **Webhooks** -{"&gt;"} **Crear Webhook**.</li>
                              <li>Haz clic en **Copiar URL del Webhook** y pégala aquí arriba. ¡Eso es todo!</li>
                            </ol>
                          </div>
                        </div>
                      )}

                      {waConfig.provider === 'webhook' && (
                        <div className="space-y-4 bg-muted/40 p-4 border rounded-2xl">
                          <div className="space-y-2">
                            <Label htmlFor="wa-webhook">URL del Webhook (POST JSON)</Label>
                            <Input
                              id="wa-webhook"
                              value={waConfig.webhookUrl || ''}
                              onChange={(e) => handleWaPropChange('webhookUrl', e.target.value)}
                              placeholder="https://hook.us1.make.com/..."
                              className="rounded-xl bg-background"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Se enviará una petición HTTP POST con los datos serializados en JSON a esta URL, ideal para integrar con Make.com, Zapier o n8n.
                          </p>
                        </div>
                      )}

                      {waConfig.provider === 'greenapi' && (
                        <div className="space-y-6 bg-muted/40 p-4 border rounded-2xl">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="ga-instance">ID de Instancia (Instance ID)</Label>
                              <Input
                                id="ga-instance"
                                value={waConfig.greenApiInstanceId || ''}
                                onChange={(e) => handleWaPropChange('greenApiInstanceId', e.target.value)}
                                placeholder="Ej: 1101123456"
                                className="rounded-xl bg-background"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="ga-token">Token de API (apiTokenInstance)</Label>
                              <Input
                                id="ga-token"
                                value={waConfig.greenApiToken || ''}
                                onChange={(e) => handleWaPropChange('greenApiToken', e.target.value)}
                                placeholder="Ej: d75b3a8c1f..."
                                className="rounded-xl bg-background"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="ga-numbers">Números de WhatsApp Destinatarios (separados por comas)</Label>
                            <Input
                              id="ga-numbers"
                              value={waConfig.numbers || ''}
                              onChange={(e) => handleWaPropChange('numbers', e.target.value)}
                              placeholder="Ej: +5493764123456, +5493764987654"
                              className="rounded-xl bg-background"
                            />
                            <p className="text-xs text-muted-foreground">
                              Ingresa los números con formato internacional (ej. +549...). El plan gratuito de Green-API permite enviar hasta a 3 chats distintos al mes.
                            </p>
                          </div>

                          {/* Verification and QR Widget */}
                          <div className="border-t pt-4 space-y-4">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="space-y-1 text-center sm:text-left">
                                <p className="font-semibold text-sm">Estado de Vinculación de WhatsApp</p>
                                <p className="text-xs text-muted-foreground">
                                  {greenStatus === 'authorized' ? (
                                    <span className="text-green-600 font-bold flex items-center gap-1 justify-center sm:justify-start">
                                      ● Activo / Conectado
                                    </span>
                                  ) : greenStatus ? (
                                    <span className="text-yellow-600 font-medium">
                                      ● Estado: {greenStatus} (No vinculado)
                                    </span>
                                  ) : (
                                    <span>Presiona verificar para consultar.</span>
                                  )}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                disabled={checkingGreen}
                                onClick={handleCheckGreenApi}
                                className="rounded-xl"
                              >
                                {checkingGreen ? (
                                  <span className="flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                                    Verificando...
                                  </span>
                                ) : 'Verificar Estado / Obtener QR'}
                              </Button>
                            </div>

                            {greenStatus === 'authorized' && (
                              <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl text-center text-green-700 text-xs font-medium">
                                ¡Listo! Tu cuenta de WhatsApp está vinculada y autorizada correctamente con Green-API. Recibirás las alertas de forma instantánea.
                              </div>
                            )}

                            {greenQr && (
                              <div className="flex flex-col items-center bg-white p-4 rounded-xl border max-w-[260px] mx-auto text-center shadow-sm">
                                <img src={greenQr} alt="Código QR para escanear" className="w-48 h-48 object-contain" />
                                <p className="text-[10px] text-zinc-500 mt-2 font-medium">
                                  Abre WhatsApp en tu celular {"->"} Dispositivos vinculados {"->"} Vincular un dispositivo, y escanea este código QR.
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-muted-foreground space-y-2 border-t pt-4">
                            <p className="font-semibold text-foreground">💡 ¿Cómo configurar Green-API gratis en 3 pasos?</p>
                            <ol className="list-decimal pl-4 space-y-1">
                              <li>Regístrate gratis en <a href="https://green-api.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">green-api.com</a>.</li>
                              <li>Crea una instancia dentro del panel de control de Green-API seleccionando el plan **Developer (Gratuito)**.</li>
                              <li>Copia el **ID de Instancia** y el **Token** que te asignen, pégalos arriba, presiona "Verificar Estado" y escanea el código QR desde tu celular.</li>
                            </ol>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end items-center border-t pt-4">
                    <Button onClick={handleSaveWaConfig} disabled={isSavingWa} className="rounded-full px-6 bg-green-600 hover:bg-green-700 text-white font-semibold">
                      {isSavingWa ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Guardando Alertas...
                        </span>
                      ) : 'Guardar Configuración de Alertas'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
