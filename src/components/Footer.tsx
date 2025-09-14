
import Link from 'next/link';
import { getSocialLinksAction, getFormDefinitionAction, getFooterContentAction } from '@/actions/data';
import { Icons } from '@/components/icons';
import { Card, CardContent } from '@/components/ui/card';
import { DynamicForm } from './DynamicForm';
import Image from 'next/image';
import { Button } from './ui/button';

export async function Footer() {
  const [socialLinks, contactFormDefinition, footerContent] = await Promise.all([
    getSocialLinksAction(),
    getFormDefinitionAction('contacto'),
    getFooterContentAction()
  ]);

  const getSocialIcon = (name: 'Facebook' | 'Twitter' | 'Instagram' | 'YouTube') => {
    switch (name) {
      case 'Facebook': return <Icons.Facebook className="h-6 w-6" />;
      case 'Twitter': return <Icons.Twitter className="h-6 w-6" />;
      case 'Instagram': return <Icons.Instagram className="h-6 w-6" />;
      case 'YouTube': return <Icons.Youtube className="h-6 w-6" />;
      default: return null;
    }
  };
  
  if (!contactFormDefinition || !footerContent) {
    return null; // or a loading state
  }

  const copyrightText = (footerContent.copyright || '').replace('{year}', new Date().getFullYear().toString());
  const creditsParts = (footerContent.credits || '').split('♥');

  return (
    <footer className="bg-card" id="contacto">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-background border-border p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                <div className="space-y-8">
                    <div>
                        <h2 className="font-headline text-2xl font-bold">{footerContent.contactTitle}</h2>
                        <p className="text-foreground/80 mt-2">{footerContent.contactDescription}</p>
                    </div>
                    <div className="space-y-4 text-foreground/90">
                        <div className="flex items-start gap-4">
                            <div>
                                <h3 className="font-semibold">{footerContent.headquartersTitle}</h3>
                                <p className="text-foreground/80">{footerContent.address}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div>
                                <h3 className="font-semibold">{footerContent.contactInfoTitle}</h3>
                                <div className="text-foreground/80 space-y-2 mt-2">
                                  <p>{footerContent.email}</p>
                                  <p>{footerContent.phone}</p>
                                  {footerContent.whatsapp && (
                                      <Button asChild variant="outline" className="bg-green-500/10 border-green-500/30 hover:bg-green-500/20 text-green-400 hover:text-green-300">
                                          <Link href={`https://wa.me/${footerContent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                                              <Icons.Whatsapp className="mr-2" />
                                              Contactar por WhatsApp
                                          </Link>
                                      </Button>
                                  )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div>
                                <h3 className="font-semibold">{footerContent.socialsTitle}</h3>
                                <div className="flex items-center gap-4 mt-2">
                                     {socialLinks.map((link) => (
                                        <Link key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-accent transition-colors">
                                            {getSocialIcon(link.name)}
                                            <span className="sr-only">{link.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {contactFormDefinition && <DynamicForm formDefinition={contactFormDefinition} />}
                </div>
            </div>
        </Card>
      </div>
      <div className="bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="Logo del Partido" width={50} height={50} />
                <span className="font-headline text-lg font-bold">Partido Libertario Misiones</span>
            </div>
            <div className="text-center text-sm text-foreground/60 sm:text-right">
                <p>{copyrightText} | <Link href="/admin" className="hover:text-accent">Admin</Link></p>
                <p className="mt-1">
                   {creditsParts.length === 2 ? (
                        <>
                            {creditsParts[0]}
                            <span className="text-red-500">♥</span>
                            {creditsParts[1]}
                        </>
                    ) : (
                        footerContent.credits
                    )}
                </p>
            </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
