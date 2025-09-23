
'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { cn } from '@/lib/utils';
import type { NotificationItem, Notification as TNotification } from '@/lib/types';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cva } from 'class-variance-authority';

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  notificationSettings: TNotification;
}

function NotificationDialog({
  item,
  children,
}: {
  item: NotificationItem;
  children: React.ReactNode;
}) {
  const isImageOnly = item.imageUrl && !item.title && !item.content;
  const isEmbed = item.content?.includes('<iframe');
  const hasTextContent = item.title || item.content;


  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn(
          isImageOnly
            ? 'w-auto max-w-5xl border-0 bg-transparent p-2 shadow-none'
            : 'max-w-xl',
           !hasTextContent && item.imageUrl ? 'p-0' : 'p-6'
        )}
      >
        {isImageOnly && item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title || 'Notificación'}
            width={1200}
            height={1200}
            className="h-auto w-auto max-h-[85vh] max-w-full rounded-lg object-contain"
            data-ai-hint={item.imageHint}
          />
        ) : (
          <>
            {item.imageUrl && !isEmbed && (
                <div className={cn("relative h-64 w-full overflow-hidden", hasTextContent ? "rounded-t-lg -mt-6 -mx-6" : "rounded-lg")}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title || 'Notificación'}
                    fill
                    className="object-cover"
                    data-ai-hint={item.imageHint}
                  />
                </div>
              )}
              
            {hasTextContent && (
                <DialogHeader className={cn(!item.imageUrl && 'pt-6')}>
                <DialogTitle className="font-headline text-2xl text-accent">
                    {item.title || 'Notificación'}
                </DialogTitle>
                <p className="text-sm text-muted-foreground pt-1">
                    {new Date(item.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                </p>
                </DialogHeader>
            )}

             {item.content && isEmbed ? (
                <div className={cn("w-full overflow-hidden", !hasTextContent && "rounded-lg")}>
                    <div className="responsive-video" dangerouslySetInnerHTML={{ __html: item.content }} />
                </div>
            ) : item.content && (
                <div className="pb-6 px-6 -mx-6">
                  <div
                    className="prose prose-sm prose-invert mt-4 max-w-full"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function NotificationDropdown({
  notifications,
  notificationSettings,
}: NotificationDropdownProps) {
  if (!notifications || notifications.length === 0 || !notificationSettings.enabled) {
    return null;
  }
  
  const glowVariants = cva(
    'group relative flex h-auto cursor-pointer items-center justify-center rounded-full border bg-secondary py-1 px-3 text-secondary-foreground shadow-lg transition-all duration-300',
    {
      variants: {
        glowColor: {
          orange: 'border-orange-500/50 hover:border-orange-400 hover:shadow-orange-500/20',
          blue: 'border-blue-500/50 hover:border-blue-400 hover:shadow-blue-500/20',
          green: 'border-green-500/50 hover:border-green-400 hover:shadow-green-500/20',
          red: 'border-red-500/50 hover:border-red-400 hover:shadow-red-500/20',
        },
      },
      defaultVariants: {
        glowColor: 'orange',
      },
    }
  );
  
  const ringVariants = cva('absolute inline-flex h-full w-full rounded-full opacity-75', {
      variants: {
          glowColor: {
              orange: 'bg-orange-400',
              blue: 'bg-blue-400',
              green: 'bg-green-400',
              red: 'bg-red-400',
          },
          glowSpeed: {
            slow: 'animate-ping-slow',
            normal: 'animate-ping',
            fast: 'animate-ping-fast'
          }
      },
      defaultVariants: {
        glowColor: 'orange',
        glowSpeed: 'normal'
      },
  });

  const pingVariants = cva('absolute inline-flex h-full w-full rounded-full opacity-75', {
      variants: {
          glowColor: {
              orange: 'bg-orange-400',
              blue: 'bg-blue-400',
              green: 'bg-green-400',
              red: 'bg-red-400',
          },
          glowSpeed: {
            slow: 'animate-ping-slow',
            normal: 'animate-ping',
            fast: 'animate-ping-fast'
          }
      },
      defaultVariants: {
        glowColor: 'orange',
        glowSpeed: 'normal'
      },
  });
  
  const dotVariants = cva('relative inline-flex h-2 w-2 rounded-full', {
      variants: {
          glowColor: {
              orange: 'bg-orange-500',
              blue: 'bg-blue-500',
              green: 'bg-green-500',
              red: 'bg-red-500',
          }
      },
      defaultVariants: {
        glowColor: 'orange',
      },
  });

  const TriggerButton = () => (
    <div className={cn(glowVariants({ glowColor: notificationSettings.glowColor }))}>
       <span className={cn(ringVariants({ glowColor: notificationSettings.glowColor, glowSpeed: notificationSettings.glowSpeed }))}></span>
      <span className="relative mr-2 flex h-2 w-2">
        <span className={cn(pingVariants({ glowColor: notificationSettings.glowColor, glowSpeed: notificationSettings.glowSpeed }))}></span>
        <span className={cn(dotVariants({ glowColor: notificationSettings.glowColor }))}></span>
      </span>
      <span className="relative text-xs font-semibold">{notificationSettings.text}</span>
    </div>
  );

  return (
    <div className="absolute top-6 right-6 z-30">
      <Popover>
        <PopoverTrigger asChild>
          <button>
            <TriggerButton />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-2">
            {notifications.map((item, index) => (
              <NotificationDialog item={item} key={item.id}>
                <button className="w-full text-left">
                  <div className={cn("space-y-1 rounded-md p-2 hover:bg-muted", index > 0 && "border-t border-border")}>
                    <p className={cn("truncate", index === 0 ? "font-semibold" : "text-sm")}>{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString(
                        'es-AR',
                        { day: 'numeric', month: 'long' }
                      )}
                    </p>
                  </div>
                </button>
              </NotificationDialog>
            ))}
             <Button asChild variant="outline" size="sm" className="w-full mt-2">
                <Link href="/notificaciones">Ver Todas</Link>
             </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
