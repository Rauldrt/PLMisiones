'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { generateNewsContent, type GenerateNewsContentOutput } from '@/ai/flows/generate-news-from-url';
import { Loader2, Globe, FileText, Lightbulb, Check, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { clientSanitize } from '@/lib/client-sanitize';

interface AIGeneratorProps {
  onApplyContent: (data: { title: string; content: string; imageHint?: string }) => void;
}

export function AIGenerator({ onApplyContent }: AIGeneratorProps) {
  const [mode, setMode] = useState<'url' | 'text' | 'idea'>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Informativo');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [includeSubheadings, setIncludeSubheadings] = useState(true);
  const [instructions, setInstructions] = useState('');
  
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const [generatedResult, setGeneratedResult] = useState<GenerateNewsContentOutput | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  const handleGenerate = () => {
    // Validation
    if (mode === 'url' && (!url || !URL.canParse(url))) {
      toast({
        variant: 'destructive',
        title: 'URL Inválida',
        description: 'Por favor, ingrese una URL válida.',
      });
      return;
    }
    if (mode === 'text' && text.trim().length < 50) {
      toast({
        variant: 'destructive',
        title: 'Texto demasiado corto',
        description: 'Por favor, ingrese al menos 50 caracteres de texto original para redactar.',
      });
      return;
    }
    if (mode === 'idea' && prompt.trim().length < 10) {
      toast({
        variant: 'destructive',
        title: 'Idea demasiado corta',
        description: 'Por favor, describe con un poco más de detalle el evento o noticia que quieres generar.',
      });
      return;
    }

    startTransition(async () => {
      try {
        setGeneratedResult(null);
        setSelectedTitle('');

        const result = await generateNewsContent({ 
          mode,
          url: mode === 'url' ? url : undefined,
          text: mode === 'text' ? text : undefined,
          prompt: mode === 'idea' ? prompt : undefined,
          tone,
          length,
          includeSubheadings,
          instructions: instructions.trim() || undefined
        });
        
        setGeneratedResult(result);
        if (result.titles && result.titles.length > 0) {
          setSelectedTitle(result.titles[0]);
        }
        
        toast({
          title: 'Noticia Generada con Éxito',
          description: 'Se ha creado un borrador de noticia con múltiples opciones de título. Revísalo a continuación.',
        });
      } catch (error) {
        console.error('Error generating content:', error);
        toast({
          variant: 'destructive',
          title: 'Error de Generación',
          description: error instanceof Error ? error.message : 'No se pudo conectar con el servicio de IA.',
        });
      }
    });
  };

  const handleApply = () => {
    if (!generatedResult || !selectedTitle) return;

    onApplyContent({
      title: selectedTitle,
      content: generatedResult.content,
      imageHint: generatedResult.imageHint,
    });

    toast({
      title: 'Borrador Aplicado',
      description: 'El contenido ha sido importado al formulario principal. Deslízate hacia abajo para guardarlo.',
    });

    // Clear generator inputs if desired, or keep them.
    // Smooth scroll to news-form
    setTimeout(() => {
      document.getElementById('news-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-card/40 backdrop-blur-md shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 h-64 w-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-64 w-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl font-headline font-bold">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            Redactor Inteligente de Noticias con IA
          </CardTitle>
          <CardDescription className="text-muted-foreground/80">
            Genera artículos profesionales listos para publicar a partir de una URL, notas de prensa sueltas o una simple idea.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs value={mode} onValueChange={(val) => setMode(val as any)} className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 border border-white/5 rounded-xl">
              <TabsTrigger value="url" disabled={isPending} className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background/80 data-[state=active]:shadow-sm">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Desde URL</span>
                <span className="inline sm:hidden">URL</span>
              </TabsTrigger>
              <TabsTrigger value="text" disabled={isPending} className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background/80 data-[state=active]:shadow-sm">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Desde Texto Libre</span>
                <span className="inline sm:hidden">Texto</span>
              </TabsTrigger>
              <TabsTrigger value="idea" disabled={isPending} className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background/80 data-[state=active]:shadow-sm">
                <Lightbulb className="h-4 w-4" />
                <span className="hidden sm:inline">Desde Idea / Prompt</span>
                <span className="inline sm:hidden">Idea</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="mt-0 focus-visible:outline-none">
              <div className="space-y-2">
                <Label htmlFor="url-input" className="text-foreground/90 font-medium">URL de la noticia original</Label>
                <Input
                  id="url-input"
                  placeholder="https://www.ejemplo.com/noticias/evento-provincial"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isPending}
                  className="bg-background/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary rounded-lg transition-all"
                />
                <p className="text-xs text-muted-foreground">La IA visitará el sitio web, extraerá los hechos relevantes y redactará una noticia original.</p>
              </div>
            </TabsContent>

            <TabsContent value="text" className="mt-0 focus-visible:outline-none">
              <div className="space-y-2">
                <Label htmlFor="text-input" className="text-foreground/90 font-medium">Contenido base o notas de prensa</Label>
                <Textarea
                  id="text-input"
                  placeholder="Pega aquí el contenido sin formato, borradores, datos desordenados o partes de comunicados de prensa para darles coherencia periodística..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={isPending}
                  rows={5}
                  className="bg-background/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary rounded-lg resize-y min-h-[120px]"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mínimo 50 caracteres recomendados.</span>
                  <span>{text.length} caracteres</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="idea" className="mt-0 focus-visible:outline-none">
              <div className="space-y-2">
                <Label htmlFor="prompt-input" className="text-foreground/90 font-medium">Describe la idea de la noticia</Label>
                <Textarea
                  id="prompt-input"
                  placeholder="Ejemplo: Redactar un artículo sobre el plenario del Partido Libertario en Posadas. Mencionar que asistieron más de 100 personas, se debatieron estrategias de afiliación, el evento fue coordinado por el referente local y se anunció la apertura de una nueva sede en Oberá para septiembre..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isPending}
                  rows={4}
                  className="bg-background/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary rounded-lg resize-y min-h-[100px]"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-foreground/90 font-medium">Tono del artículo</Label>
              <Select value={tone} onValueChange={setTone} disabled={isPending}>
                <SelectTrigger className="bg-background/50 border-white/10 rounded-lg">
                  <SelectValue placeholder="Selecciona un tono" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Informativo">Informativo (Neutral / Prensa)</SelectItem>
                  <SelectItem value="Institucional">Institucional (Formal / Oficial)</SelectItem>
                  <SelectItem value="Entusiasta">Entusiasta (Militante / Dinámico)</SelectItem>
                  <SelectItem value="Crítico">Crítico (Analítico / Reflexivo)</SelectItem>
                  <SelectItem value="Persuasivo">Persuasivo (Opinión / Convocatoria)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground/90 font-medium">Extensión aproximada</Label>
              <div className="grid grid-cols-3 gap-2 bg-muted/30 p-1 border border-white/5 rounded-lg h-10 items-center">
                <button
                  type="button"
                  onClick={() => setLength('short')}
                  disabled={isPending}
                  className={cn(
                    "text-xs font-medium py-1 px-2 rounded-md transition-all h-full",
                    length === 'short' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Corto
                </button>
                <button
                  type="button"
                  onClick={() => setLength('medium')}
                  disabled={isPending}
                  className={cn(
                    "text-xs font-medium py-1 px-2 rounded-md transition-all h-full",
                    length === 'medium' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Medio
                </button>
                <button
                  type="button"
                  onClick={() => setLength('long')}
                  disabled={isPending}
                  className={cn(
                    "text-xs font-medium py-1 px-2 rounded-md transition-all h-full",
                    length === 'long' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Extenso
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-end space-y-3 pb-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="structure-switch" className="cursor-pointer text-foreground/90 font-medium flex flex-col gap-0.5">
                  <span>Estructurar con Subtítulos</span>
                  <span className="text-xs font-normal text-muted-foreground">Inserta encabezados H2 de sección</span>
                </Label>
                <Switch
                  id="structure-switch"
                  checked={includeSubheadings}
                  onCheckedChange={setIncludeSubheadings}
                  disabled={isPending}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="news-instructions" className="text-foreground/90 font-medium">Instrucciones Adicionales (Opcional)</Label>
            <Input
              id="news-instructions"
              placeholder="Ej: Destacar la frase de Javier Milei, escribir en 3 párrafos, no mencionar cifras todavía..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              disabled={isPending}
              className="bg-background/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary rounded-lg"
            />
          </div>

          <div className="flex justify-end pt-6">
            <Button
              onClick={handleGenerate}
              disabled={isPending || (mode === 'url' && !url) || (mode === 'text' && !text) || (mode === 'idea' && !prompt)}
              className="w-full md:w-auto font-medium px-6 py-5 rounded-lg bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all duration-300 shadow-lg shadow-purple-500/20 active:scale-[0.98]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Procesando con IA...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Redactar Noticia
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedResult && (
        <Card className="border-purple-500/30 bg-card/60 shadow-[0_0_30px_rgba(139,31,164,0.1)] rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 px-6 py-4 border-b border-purple-500/20 flex items-center justify-between">
            <h3 className="font-headline font-bold text-lg text-purple-200 flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-400 bg-emerald-400/10 p-0.5 rounded-full" />
              Borrador de Noticia Listo
            </h3>
            <Badge variant="outline" className="border-purple-500/40 text-purple-200 bg-purple-950/40">
              Gemini AI
            </Badge>
          </div>

          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <Label className="text-foreground/90 font-semibold text-sm tracking-wider uppercase">
                1. Selecciona el título que prefieras
              </Label>
              <div className="grid gap-2">
                {generatedResult.titles.map((titleOption, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedTitle(titleOption)}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                      selectedTitle === titleOption
                        ? "bg-purple-950/20 border-purple-500/60 shadow-[0_0_15px_rgba(139,31,164,0.1)]"
                        : "bg-background/20 border-white/5 hover:border-white/10 hover:bg-background/40"
                    )}
                  >
                    <div className={cn(
                      "h-5 w-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 transition-all",
                      selectedTitle === titleOption
                        ? "border-purple-500 bg-purple-600 text-white"
                        : "border-muted-foreground/30 bg-transparent"
                    )}>
                      {selectedTitle === titleOption && <Check className="h-3 w-3" />}
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      selectedTitle === titleOption ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {titleOption}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-background/30 border border-white/5 space-y-2">
                <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                  Pista de Imagen Sugerida
                </span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600 hover:bg-blue-600/90 text-white text-xs py-1 px-2.5 rounded-md">
                    {generatedResult.imageHint}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Usa esto en la galería para buscar una imagen acorde.</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background/30 border border-white/5 space-y-2">
                <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                  Resumen de SEO (Meta descripción)
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {generatedResult.seoDescription}
                </p>
                <div className="flex justify-end">
                  <span className="text-[10px] text-muted-foreground/50">
                    {generatedResult.seoDescription.length} / 155 caracteres
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground/90 font-semibold text-sm tracking-wider uppercase">
                2. Vista previa del cuerpo del artículo
              </Label>
              <div className="border border-white/10 rounded-xl bg-background/50 overflow-hidden shadow-inner">
                <div className="h-10 bg-muted/40 border-b border-white/5 px-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Visualización en formato web</span>
                  <span>HTML Limpio</span>
                </div>
                <div className="p-6 max-h-[300px] overflow-y-auto pr-4">
                  <div 
                    className="prose prose-sm prose-invert max-w-none text-foreground/90 prose-headings:font-headline prose-headings:text-purple-300 prose-strong:text-foreground prose-p:leading-relaxed prose-p:mb-4"
                    dangerouslySetInnerHTML={{ __html: clientSanitize(generatedResult.content) }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground text-center sm:text-left">
                <AlertCircle className="h-4 w-4 text-purple-400 shrink-0" />
                <span>Al aplicar, el contenido se cargará en el formulario de edición para que puedas revisarlo y publicarlo.</span>
              </div>
              <Button
                onClick={handleApply}
                className="w-full sm:w-auto font-medium px-8 py-5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md active:scale-[0.98]"
              >
                Aplicar al Formulario de Creación
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
