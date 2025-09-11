
'use client';

import { Icons, IconName } from '@/components/icons';

interface PageHeaderProps {
  icon: string;
  title: string;
  description: string;
}

export function PageHeader({ icon, title, description }: PageHeaderProps) {
  const IconComponent = Icons[icon as IconName] || null;
  return (
    <div className="bg-card py-8">
      <div className="container text-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          {IconComponent && <IconComponent className="h-6 w-6" />}
        </div>
        <h1 className="mt-4 font-headline text-3xl font-bold md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-base text-foreground/80">
          {description}
        </p>
      </div>
    </div>
  );
}
