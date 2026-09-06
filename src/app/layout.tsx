import type { ReactNode } from 'react';

import type { Metadata } from 'next';

import { AppProviders } from '@/providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  description: 'MarkePublish',
  title: 'MarkePublish',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className="bg-background text-foreground" lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
