import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

// Mock the components and icons that Footer uses
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock('next/image', () => {
  return ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  );
});

jest.mock('@/components/GoogleFormEmbed', () => ({
  GoogleFormEmbed: () => <div data-testid="google-form-embed">Google Form Mock</div>
}));

jest.mock('@/components/icons', () => ({
  Icons: {
    Whatsapp: () => <div data-testid="whatsapp-icon">Whatsapp Icon</div>,
    Social: () => <div data-testid="social-icon">Social Icon</div>
  },
  getIcon: (name: string) => {
    if (name === 'facebook') return () => <div data-testid="facebook-icon">Facebook Icon</div>;
    return null;
  }
}));

describe('Footer Component', () => {
  const mockSocialLinks = [
    { id: '1', name: 'facebook', url: 'https://facebook.com', icon: 'facebook' },
    { id: '2', name: 'twitter', url: 'https://twitter.com', icon: 'twitter' }
  ];

  const mockContactForm = {
    id: '1',
    title: 'Test Form',
    description: 'Test Description',
    embedUrl: 'https://docs.google.com/forms/d/e/123/viewform'
  };

  const mockFooterContent = {
    contactTitle: 'Contacto',
    contactDescription: 'Póngase en contacto con nosotros.',
    headquartersTitle: 'Sede',
    address: 'Calle Falsa 123',
    contactInfoTitle: 'Información',
    email: 'test@example.com',
    phone: '123-456-7890',
    whatsapp: '123-456-7890',
    socialsTitle: 'Redes Sociales',
    copyright: '© {year} Test',
    credits: 'Made with ♥ by OpenAI'
  };

  it('renders null when contactForm or footerContent is missing', () => {
    const { container: container1 } = render(
      <Footer
        socialLinks={mockSocialLinks}
        contactForm={null as any}
        footerContent={mockFooterContent}
      />
    );
    expect(container1.firstChild).toBeNull();

    const { container: container2 } = render(
        <Footer
          socialLinks={mockSocialLinks}
          contactForm={mockContactForm}
          footerContent={null as any}
        />
      );
      expect(container2.firstChild).toBeNull();
  });

  it('renders footer text content correctly', () => {
    render(
      <Footer
        socialLinks={mockSocialLinks}
        contactForm={mockContactForm}
        footerContent={mockFooterContent}
      />
    );

    expect(screen.getByText('Contacto')).toBeInTheDocument();
    expect(screen.getByText('Póngase en contacto con nosotros.')).toBeInTheDocument();
    expect(screen.getByText('Sede')).toBeInTheDocument();
    expect(screen.getByText('Calle Falsa 123')).toBeInTheDocument();
    expect(screen.getByText('Información')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('Redes Sociales')).toBeInTheDocument();
  });

  it('renders WhatsApp button with correctly formatted URL', () => {
    render(
        <Footer
          socialLinks={mockSocialLinks}
          contactForm={mockContactForm}
          footerContent={{...mockFooterContent, whatsapp: '+54 9 11 1234-5678'}}
        />
    );

    const whatsappLink = screen.getByText('Contactar por WhatsApp').closest('a');
    expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/5491112345678');
    expect(screen.getByTestId('whatsapp-icon')).toBeInTheDocument();
  });

  it('does not render WhatsApp button if missing', () => {
    render(
        <Footer
          socialLinks={mockSocialLinks}
          contactForm={mockContactForm}
          footerContent={{...mockFooterContent, whatsapp: ''}}
        />
    );

    expect(screen.queryByText('Contactar por WhatsApp')).not.toBeInTheDocument();
  });

  it('renders social links and falls back to Icons.Social if getIcon returns null', () => {
    render(
        <Footer
          socialLinks={mockSocialLinks}
          contactForm={mockContactForm}
          footerContent={mockFooterContent}
        />
    );

    const facebookLink = screen.getByText('facebook').closest('a');
    expect(facebookLink).toHaveAttribute('href', 'https://facebook.com');
    expect(screen.getByTestId('facebook-icon')).toBeInTheDocument();

    const twitterLink = screen.getByText('twitter').closest('a');
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com');
    expect(screen.getByTestId('social-icon')).toBeInTheDocument(); // fallback
  });

  it('renders GoogleFormEmbed when contactForm.embedUrl is present', () => {
    render(
      <Footer
        socialLinks={mockSocialLinks}
        contactForm={mockContactForm}
        footerContent={mockFooterContent}
      />
    );

    expect(screen.getByTestId('google-form-embed')).toBeInTheDocument();
  });

  it('renders fallback text when contactForm.embedUrl is absent', () => {
    render(
      <Footer
        socialLinks={mockSocialLinks}
        contactForm={{ ...mockContactForm, embedUrl: '' }}
        footerContent={mockFooterContent}
      />
    );

    expect(screen.getByText('El formulario de contacto no está disponible.')).toBeInTheDocument();
  });

  it('replaces {year} dynamically in copyright text', () => {
    render(
        <Footer
          socialLinks={mockSocialLinks}
          contactForm={mockContactForm}
          footerContent={mockFooterContent}
        />
    );

    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(`© ${currentYear} Test |`)).toBeInTheDocument();
  });

  it('renders credits correctly when containing the "♥" character', () => {
    render(
        <Footer
          socialLinks={mockSocialLinks}
          contactForm={mockContactForm}
          footerContent={{...mockFooterContent, credits: 'Made with ♥ by Team'}}
        />
    );

    expect(screen.getByText(/Made with/)).toBeInTheDocument();
    expect(screen.getByText('♥')).toBeInTheDocument();
    expect(screen.getByText('♥')).toHaveClass('text-red-500');
    expect(screen.getByText(/by Team/)).toBeInTheDocument();
  });

  it('renders credits as fallback when NOT containing the "♥" character', () => {
    render(
        <Footer
          socialLinks={mockSocialLinks}
          contactForm={mockContactForm}
          footerContent={{...mockFooterContent, credits: 'Made by Open Source'}}
        />
    );

    expect(screen.getByText('Made by Open Source')).toBeInTheDocument();
    expect(screen.queryByText('♥')).not.toBeInTheDocument();
  });
});