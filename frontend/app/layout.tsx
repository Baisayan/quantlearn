"use client";

import Link from "next/link";
import { ArrowRight, CircleUserRound, LoaderCircle, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

import "./globals.css";

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const appLinks = [
  { href: "/learn", label: "Learn" },
  { href: "/lab", label: "Lab" },
];

function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  const isHome = pathname === "/";
  const isLogin = pathname === "/login";
  const isApplicationRoute = !isHome && !isLogin;
  const isProgress = pathname === "/progress" || pathname.startsWith("/progress/");
  const headerWidth = isHome ? "max-w-screen-2xl" : "";

  async function handleSignOut() {
    setSignOutError("");
    setIsSigningOut(true);

    const { error } = await createClient().auth.signOut();

    if (error) {
      setSignOutError(error.message);
      setIsSigningOut(false);
      return;
    }

    router.replace("/");
    router.refresh();
    setIsSigningOut(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div
        className={`mx-auto flex min-h-16 w-full ${headerWidth} flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-3 sm:px-8 lg:px-10`}
      >
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
        >
          <span className="text-foreground">Quant</span>
          <span className="text-primary">Learn</span>
        </Link>

        {isHome ? (
          <Button
            asChild
            size="default"
            className="h-auto rounded-md px-4 py-2 font-medium shadow-md sm:px-5"
          >
            <Link href="/learn">
              Getting started
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        ) : null}

        {isLogin ? (
          <Button
            asChild
            variant="outline"
            className="rounded-md border-primary/30 bg-card text-primary shadow-sm hover:bg-primary-soft hover:text-primary"
          >
            <Link href="/">Home</Link>
          </Button>
        ) : null}

        {isApplicationRoute ? (
          <>
            <nav
              className="order-3 flex basis-full items-center justify-center gap-1 sm:gap-2 lg:order-none lg:ml-auto lg:basis-auto"
              aria-label="Application navigation"
            >
              {appLinks.map(({ href, label }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Button
                    key={href}
                    asChild
                    size="sm"
                    variant={active ? "default" : "ghost"}
                    className="rounded-md px-4"
                  >
                    <Link href={href} aria-current={active ? "page" : undefined}>
                      {label}
                    </Link>
                  </Button>
                );
              })}
            </nav>

            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              {isProgress ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-md"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? (
                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <LogOut className="size-4" aria-hidden="true" />
                  )}
                  Sign out
                </Button>
              ) : (
                <Button asChild variant="ghost" size="icon" className="rounded-md">
                  <Link href="/progress" aria-label="Open profile and progress">
                    <CircleUserRound className="size-5" aria-hidden="true" />
                  </Link>
                </Button>
              )}
              {signOutError ? (
                <span className="text-sm text-primary" role="alert">
                  {signOutError}
                </span>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </header>
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";
  const contentTop = isHome ? "pt-16" : "pt-20 md:pt-16";
  const shellBackground = "bg-background";

  return (
    <html lang="en">
      <head>
        <title>QuantLearn</title>
        <meta
          name="description"
          content="Learn quantum computing through guided lessons, interactive circuits and AI explanations."
        />
      </head>
      <body>
        <div className={`relative isolate min-h-svh text-foreground ${shellBackground}`}>
          <SiteHeader />
          <div className={`relative z-10 flex min-h-svh flex-col ${contentTop}`}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
