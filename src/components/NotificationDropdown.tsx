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
  const isEmbed = item.content?.includes('<iframe');

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn(
          isImageOnly
            ? 'w-auto max-w-5xl border-0 bg-transparent p-2 shadow-none'
            : 'max-w-xl p-0'
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
            <DialogHeader className="p-6 pb-2">
              {item.imageUrl && (
                <div className="relative mb-6 h-64 w-full overflow-hidden rounded-lg">
                  <Image
                    src={item.imageUrl}
                    alt={item.title || 'Notificación'}
                    fill
                    className="object-cover"
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
             {isEmbed ? (
                <div className="responsive-video mt-4 rounded-b-lg overflow-hidden">
                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                </div>
            ) : (
                <div className="px-6 pb-6">
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
}: NotificationDropdownProps) {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  const latestNotification = notifications[0];

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
          <div className="space-y-2">
            {notifications.map((item, index) => (
              <NotificationDialog item={item} key={item.id}>
                <button className="w-full text-left">
                  <div className={cn("space-y-1 rounded-md p-2 hover:bg-muted", index === 0 && "border-b border-border")}>
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
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
