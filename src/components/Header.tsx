"use client";

import { Ghost, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    // Only handle scroll if we're on the home page
    if (pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        router.push(`/#${id}`);
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-heading font-bold text-foreground"
          >
            <div className="bg-primary/20 p-1.5 rounded-lg border border-primary/30">
              <Ghost className="w-5 h-5 text-secondary" />
            </div>
            AnoniMessage
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link
              href="/#features"
              className="hover:text-foreground transition-colors"
              onClick={(e) => handleScroll(e, "features")}
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="hover:text-foreground transition-colors"
              onClick={(e) => handleScroll(e, "how-it-works")}
            >
              How it Works
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {!session ? (
              <>
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-foreground hover:bg-accent px-6 h-11 transition-all rounded-lg inline-flex items-center justify-center text-sm"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="h-11 px-6">Get Started</Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard">
                <Button className="h-11 px-6">Dashboard</Button>
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="md:hidden border-b border-white/5 bg-background/95 backdrop-blur-md px-4 py-4 space-y-4">
          <nav className="flex flex-col gap-4 text-sm font-medium">
            <Link
              href="/#features"
              className="text-muted-foreground hover:text-foreground"
              onClick={(e) => handleScroll(e, "features")}
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-muted-foreground hover:text-foreground"
              onClick={(e) => handleScroll(e, "how-it-works")}
            >
              How it Works
            </Link>
          </nav>
          <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
            {!session ? (
              <>
                <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Log in
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full justify-center">Get Started</Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full justify-center">Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
