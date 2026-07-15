import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonnar";
import { Inter, Syne } from "next/font/google";
import NextAuthProvider from "@/providers/NextAuth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SessionProvider } from "@/store/session";

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AnoniMessage",
  description: "Anonymous Messaging",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} font-sans antialiased scroll-smooth scroll-pt-16`}
      data-scroll-behavior="smooth"
    >
      <body>
        <NextAuthProvider session={session}>
          <SessionProvider>
            <Toaster position="top-right" duration={3000} richColors />
            {children}
          </SessionProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
