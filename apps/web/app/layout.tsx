import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Progravity | State of the Art",
  description: "Universal Application Framework",
};

import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@progravity/ui";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import { TRPCProvider } from "../lib/trpc-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
          <TRPCProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
