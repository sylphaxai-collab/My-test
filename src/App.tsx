'use client';

import { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-soft-gray text-navy font-sans min-h-screen">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <main className="bg-cream shadow-lg rounded-lg p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
