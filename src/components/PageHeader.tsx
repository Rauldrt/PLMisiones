'use client';

interface PageHeaderProps {
  icon: string;
  title: string;
  description: string;
}

export function PageHeader({ icon, title, description }: PageHeaderProps) {
  return (
    <div className="bg-card py-16">
      <div className="container text-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          {/* Icon placeholder */}
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
