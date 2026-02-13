import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Red de Cuidados - Gran Arguello',
  description: 'Red territorial de cuidados y salud mental comunitaria.',
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
