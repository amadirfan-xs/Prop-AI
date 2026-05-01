import React from "react";
import "@/app/globals.css";
import 'react-phone-number-input/style.css';
import ToasterProvider from '@/components/common/ToasterProvider';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import GlobalPermissionModal from '@/components/common/GlobalPermissionModal';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PMS | Premium Property Management',
  description: 'The ultimate platform for modern property management and real estate portfolio tracking.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..40,400..700,0..1,-50..200" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <NotificationProvider>
            {children}
            <ToasterProvider />
            <GlobalPermissionModal />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
