
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
import type { NotificationItem } from '@/lib/types';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface NotificationDropdownProps {
  notifications: NotificationItem[];
}

function NotificationDialog({
  item,
  children,
}: {
  item: NotificationItem;
  children: React.ReactNode;
}) {
  const isImageOnly = item.imageUrl && !item.title && !item.content;
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn(
          isImageOnly
            ? 'w-auto max-w-5xl border-0 bg-transparent p-2 shadow-none'
            : 'max-w-xl'
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
            <DialogHeader>
              {item.imageUrl && (
                <div className="relative -mx-6 -mt-6 mb-6 h-48 w-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="rounded-t-lg object-cover"
                    data-ai-hint={item.imageHint}
                  />
                </div>
              )}
              <DialogTitle className="font-headline text-2xl text-accent">
                {item.title || 'Notificación'}
              </DialogTitle>
              <p className="text-sm text-muted-foreground pt-1">
                 {new Date(item.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
              </p>
            </DialogHeader>
            <div
              className="prose prose-sm prose-invert mt-4 max-w-full"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
            <Button asChild className="mt-4">
              <Link href="/notificaciones">Ver todas las notificaciones</Link>
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function NotificationDropdown({
  notifications,
}: NotificationDropdownProps) {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  const latestNotification = notifications[0];
  const otherNotifications = notifications.slice(1);

  const TriggerButton = () => (
    <div
      className={cn(
        'group flex h-auto animate-pulse-slow cursor-pointer items-center justify-center rounded-full border border-accent bg-secondary py-1 px-3 text-secondary-foreground shadow-lg hover:animate-none hover:bg-secondary/80'
      )}
    >
      <span className="relative mr-2 flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
      </span>
      <span className="text-xs font-semibold">{latestNotification.title}</span>
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
          <div className="space-y-4">
            <NotificationDialog item={latestNotification}>
              <button className="w-full text-left">
                <div className="space-y-1 rounded-md p-2 hover:bg-muted">
                  <p className="font-semibold">{latestNotification.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(latestNotification.date).toLocaleDateString(
                      'es-AR',
                      { day: 'numeric', month: 'long' }
                    )}
                  </p>
                </div>
              </button>
            </NotificationDialog>

            {otherNotifications.length > 0 && (
              <>
                <hr className="border-border" />
                <div className="space-y-2">
                  {otherNotifications.map((item) => (
                     <NotificationDialog item={item} key={item.id}>
                        <button className="w-full text-left">
                            <div className="rounded-md p-2 hover:bg-muted">
                               <p className="truncate text-sm">{item.title}</p>
                            </div>
                        </button>
                     </NotificationDialog>
                  ))}
                </div>
              </>
            )}
             <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/notificaciones">Ver Todas</Link>
             </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
