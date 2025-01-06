import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {ThemeProvider} from "@/components/theme-provider";
import Sidebar from '@/components/menu/Sidebar';
import {Footer} from '@/components/menu/Footer';
import {SessionProvider} from "next-auth/react";
import React from "react";
import RequireAuth from '@/components/auth/RequireAuth';

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Gestion de Facturation',
    description: 'Application de gestion de facturation intégrée',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
        <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex min-h-screen">
                <SessionProvider>
                    {/*<RequireAuth>*/}
                        <Sidebar/>
                        <div className="flex flex-col flex-1">
                            <main className="flex-1 overflow-auto m-5">
                                {children}
                            </main>
                            <Footer/>
                        </div>
                    {/*</RequireAuth>*/}
                </SessionProvider>
            </div>
        </ThemeProvider>
        </body>
        </html>
    )
}