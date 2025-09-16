
import type {NextConfig} from 'next';
import withPWA from 'next-pwa';

// Load environment variables from .env file
import { config } from 'dotenv';
config();

const pwaConfig = withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
});

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://www.youtube.com https://s.ytimg.com https://www.instagram.com *.cdninstagram.com datawrapper.dwcdn.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://picsum.photos *.cdninstagram.com *.fbcdn.net;
    font-src 'self' https://fonts.gstatic.com;
    frame-src 'self' https://www.youtube.com https://www.instagram.com datawrapper.dwcdn.net;
    connect-src 'self' https://vitals.vercel-insights.com https://identitytoolkit.googleapis.com;
`;


const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
    async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ]
  },
};

export default pwaConfig(nextConfig);
