import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SupportFlow',
  description: 'Centralização e continuidade de chamados técnicos',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
