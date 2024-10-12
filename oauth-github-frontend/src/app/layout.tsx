"use client";


import { Toaster } from "sonner";
import "./globals.css";
import { SessionProvider } from "next-auth/react";




export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" data-theme="light">
      <body>
        <div className="min-h-screen w-[90%] mx-auto"> <SessionProvider>{children}</SessionProvider></div>
        <Toaster />
      </body>
    </html>
  );
}
