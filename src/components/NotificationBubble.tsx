
'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { cn } from '@/lib/utils';
import type { Notification } from '@/lib/types';
import Image from 'next/image';

interface NotificationBubbleProps {
    notification: Notification;
}

export function NotificationBubble({ notification }: NotificationBubbleProps) {
    if (!notification?.enabled) {
        return null;
    }
    
    const hasLink = notification.link && notification.link.trim() !== '';
    const isImageOnly = notification.imageUrl && !notification.title && !notification.content;

    const BubbleContent = () => (
        <div className={cn(
            "group flex items-center justify-center h-auto animate-pulse-slow hover:animate-none rounded-full py-1 px-3 shadow-lg border border-accent",
             "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )}>
            <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-xs font-semibold">{notification.text}</span>
        </div>
    );

    if (hasLink) {
        return (
            <Link href={notification.link} className="absolute top-6 right-6 z-30">
                <BubbleContent />
            </Link>
        );
    }
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="absolute top-6 right-6 z-30">
                     <BubbleContent />
                </button>
            </DialogTrigger>
            <DialogContent className={cn(isImageOnly ? "p-0 border-0 max-w-3xl" : "max-w-xl")}>
                {isImageOnly && notification.imageUrl ? (
                    <div className="relative aspect-video w-full">
                        <Image
                            src={notification.imageUrl}
                            alt={notification.title || "Notificación"}
                            fill
                            className="rounded-lg object-cover"
                            data-ai-hint={notification.imageHint}
                        />
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            {notification.imageUrl && (
                                <div className="relative h-48 w-full -mx-6 -mt-6 mb-6">
                                    <Image
                                        src={notification.imageUrl}
                                        alt={notification.title}
                                        fill
                                        className="rounded-t-lg object-cover"
                                        data-ai-hint={notification.imageHint}
                                    />
                                </div>
                            )}
                            <DialogTitle className="font-headline text-2xl text-accent">{notification.title || 'Notificación'}</DialogTitle>
                        </DialogHeader>
                        <div 
                            className="mt-4 prose prose-sm prose-invert max-w-full"
                            dangerouslySetInnerHTML={{ __html: notification.content }}
                        />
                        <Button asChild className="mt-4">
                            <Link href="/notificaciones">Ver todas las notificaciones</Link>
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
