import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Red de Cuidados - Gran Arguello',
  description: 'Red territorial de cuidados y salud mental comunitaria.',
  keywords: ['red de cuidados', 'salud mental', 'comunidad', 'gran arguello'],
  authors: [{ name: 'Red de Cuidados' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
