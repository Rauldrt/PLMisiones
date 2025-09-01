
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // These classes are dynamically generated for the mosaic tiles,
    // so we need to tell Tailwind to keep them.
    'md:col-span-1',
    'md:col-span-2',
    'md:row-span-1',
    'md:row-span-2',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Roboto', 'sans-serif'],
        headline: ['Montserrat', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'zoom-in-out': {
          '0%': { transform: 'scale(1)', opacity: '0' },
          '10%': { transform: 'scale(1)', opacity: '1' },
          '90%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1.05)', opacity: '0' },
        },
        'slide-in-out-left': {
            '0%': { transform: 'translateX(-100%)', opacity: '0' },
            '10%': { transform: 'translateX(0)', opacity: '1' },
            '90%': { transform: 'translateX(0)', opacity: '1' },
            '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'slide-in-out-right': {
            '0%': { transform: 'translateX(100%)', opacity: '0' },
            '10%': { transform: 'translateX(0)', opacity: '1' },
            '90%': { transform: 'translateX(0)', opacity: '1' },
            '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        'fade-in-out': {
          '0%, 100%': { opacity: '0' },
          '10%, 90%': { opacity: '1' },
        },
        'bg-zoom-in': {
          from: { transform: 'scale(1.05)' },
          to: { transform: 'scale(1)' },
        },
        'bg-fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bg-slide-from-left': {
            from: { transform: 'translateX(-5%)', opacity: '0.8' },
            to: { transform: 'translateX(0)', opacity: '1' },
        },
        'bg-slide-from-right': {
            from: { transform: 'translateX(5%)', opacity: '0.8' },
            to: { transform: 'translateX(0)', opacity: '1' },
        },
        'pulse-slow': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '0.9',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'zoom-in-out': 'zoom-in-out linear infinite',
        'slide-in-out-left': 'slide-in-out-left linear infinite',
        'slide-in-out-right': 'slide-in-out-right linear infinite',
        'fade-in-out': 'fade-in-out linear infinite',
        'zoom-in': 'bg-zoom-in forwards',
        'fade': 'bg-fade ease-in-out forwards',
        'slide-from-left': 'bg-slide-from-left ease-out forwards',
        'slide-from-right': 'bg-slide-from-right ease-out forwards',
        'pulse-slow': 'pulse-slow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionDuration: {
        '2000': '2000ms',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
