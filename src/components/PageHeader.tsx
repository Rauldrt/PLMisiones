'use client';
import { getIcon, IconName } from './icons';

interface PageHeaderProps {
  icon: string;
  title: string;
  description: string;
}

export function PageHeader({ icon, title, description }: PageHeaderProps) {
  const IconComponent = getIcon(icon);

  return (
    <div className="bg-card py-16">
      <div className="container text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <IconComponent className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-headline text-4xl font-bold text-primary md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
          {description}
        </p>
      </div>
    </div>
  );
}
