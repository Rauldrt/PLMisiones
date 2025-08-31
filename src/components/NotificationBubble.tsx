
'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import { Icons } from './icons';
import type { Notification } from '@/lib/types';

interface NotificationBubbleProps {
    notification: Notification;
}

export function NotificationBubble({ notification }: NotificationBubbleProps) {
    if (!notification?.enabled) {
        return null;
    }

    return (
        <Button asChild variant="secondary" className="group absolute top-6 right-6 z-30 h-auto animate-pulse-slow hover:animate-none rounded-full py-2 px-4 shadow-lg border border-accent">
            <Link href={notification.link}>
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                </span>
                <span className="text-sm font-semibold">{notification.text}</span>
            </Link>
        </Button>
    )
}
