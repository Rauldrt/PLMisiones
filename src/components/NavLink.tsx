'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

export function NavLink({ href, isActive, children }: NavLinkProps) {
  const createRipple = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const link = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(link.clientWidth, link.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - link.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - link.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    // Custom color for ripple
    circle.style.backgroundColor = 'hsla(var(--primary-foreground), 0.5)';

    const ripple = link.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }
    link.appendChild(circle);
  };

  return (
    <Link
      href={href}
      onClick={createRipple}
      className={cn(
        'relative overflow-hidden rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out hover:scale-105 hover:bg-muted',
        isActive ? 'font-semibold text-primary' : 'text-foreground/80'
      )}
    >
      {children}
    </Link>
  );
}
