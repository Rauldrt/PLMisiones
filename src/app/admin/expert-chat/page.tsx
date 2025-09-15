
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { chatWithGem } from '@/ai/flows/chat-with-gem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'gem';
  content: string;
}

export default function ExpertChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      try {
        const result = await chatWithGem({ prompt: input });
        const gemMessage: Message = { role: 'gem', content: result.response };
        setMessages((prev) => [...prev, gemMessage]);
      } catch (error) {
        console.error('Error chatting with Gem:', error);
        const errorMessage: Message = { role: 'gem', content: 'Lo siento, no pude procesar tu solicitud.' };
        setMessages((prev) => [...prev, errorMessage]);
        toast({
          variant: 'destructive',
          title: 'Error de Comunicación',
          description: 'No se pudo obtener una respuesta de la Gem experta.',
        });
      }
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div>
        <h1 className="text-3xl font-bold font-headline">Chat Experto</h1>
        <p className="text-muted-foreground">Interactúa con la Gem especializada en el Partido Libertario Misiones.</p>
      </div>

      <Card className="mt-4 flex-1 flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Icons.AI className="h-6 w-6 text-primary" />
            Asistente Libertario
          </CardTitle>
          <CardDescription>
            Haz preguntas sobre estatutos, propuestas, historia o cualquier dato del partido.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {message.role === 'gem' && (
                    <Avatar className='border border-primary'>
                      <AvatarFallback>IA</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn(
                    'max-w-lg rounded-lg px-4 py-2', 
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                   {message.role === 'user' && (
                    <Avatar>
                      <AvatarFallback>TÚ</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isPending && (
                    <div className="flex items-start gap-3 justify-start">
                        <Avatar className='border border-primary'>
                            <AvatarFallback>IA</AvatarFallback>
                        </Avatar>
                        <div className="max-w-lg rounded-lg px-4 py-3 bg-muted flex items-center space-x-2">
                            <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
                        </div>
                    </div>
                )}
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Escribe tu pregunta aquí..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isPending && handleSendMessage()}
                disabled={isPending}
              />
              <Button onClick={handleSendMessage} disabled={isPending || !input.trim()}>
                {isPending ? 'Pensando...' : 'Enviar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
