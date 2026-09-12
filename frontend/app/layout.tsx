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
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-4 sm:px-8 sm:py-5 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-y-0 lg:px-10">
      <Link
        href="/"
        aria-label="QuantLearn home"
        className="text-2xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
      >
        <span className="text-foreground">Quant</span>
        <span className="text-primary">Learn</span>
      </Link>

      {isHome ? (
        <Button
          asChild
          size="lg"
          className="h-auto rounded-full px-6 py-3 font-medium shadow-lg shadow-primary/25 sm:px-8 md:col-start-3 md:row-start-1 md:justify-self-end"
        >
          <Link href="/learn">
            Getting Started
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      ) : null}

      {isLogin ? (
        <Button
          asChild
          variant="outline"
          className="rounded-full border-primary/30 bg-white/40 text-primary shadow-sm hover:bg-white/70 hover:text-primary md:col-start-3 md:row-start-1 md:justify-self-end"
        >
          <Link href="/">Home</Link>
        </Button>
      ) : null}

      {isApplicationRoute ? (
        <>
          <nav
            className="order-3 flex basis-full items-center justify-center gap-1 sm:gap-2 md:order-none md:col-start-2 md:row-start-1 md:basis-auto"
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
                  className="rounded-full px-4"
                >
                  <Link href={href} aria-current={active ? "page" : undefined}>
                    {label}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2 md:col-start-3 md:row-start-1 md:justify-self-end">
            {isProgress ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
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
              <Button asChild variant="ghost" size="icon" className="rounded-full">
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
    </header>
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
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
        <div className="flex min-h-svh flex-col bg-[radial-gradient(circle_at_center,var(--background)_0%,var(--background)_34%,var(--secondary)_68%,var(--accent)_100%)] text-foreground">
          <SiteHeader />
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      </body>
    </html>
  );
}
