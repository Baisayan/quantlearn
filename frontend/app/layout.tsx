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

const buttonMotion =
  "transition-[transform,background-color,border-color,color,box-shadow] duration-[160ms] [transition-timing-function:cubic-bezier(0.2,0,0,1)] active:scale-[0.96]";

function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  const isHome = pathname === "/";
  const isLogin = pathname === "/login";
  const isApplicationRoute = !isHome && !isLogin;
  const isProgress = pathname === "/progress" || pathname.startsWith("/progress/");
  const headerWidth = isHome ? "max-w-[94rem]" : "";

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
        className={`mx-auto flex min-h-20 w-full ${headerWidth} flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-4 sm:px-8 lg:px-10`}
      >
        <Link
          href="/"
          aria-label="QuantLearn home"
          className="font-display text-2xl font-semibold tracking-[-0.055em] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
        >
          <span className="text-foreground">Quant</span>
          <span className="text-primary">Learn</span>
        </Link>

        {isHome ? (
          <Button
            asChild
            size="lg"
            className={`${buttonMotion} h-auto rounded-xl px-5 py-2.5 font-medium shadow-[0_8px_18px_rgba(35,87,217,0.18)] sm:px-6`}
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
            className={`${buttonMotion} rounded-xl border-primary/30 bg-white/70 text-primary shadow-sm hover:bg-primary-soft hover:text-primary`}
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
                    className={`${buttonMotion} rounded-xl px-4`}
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
                  className={`${buttonMotion} rounded-xl`}
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
                <Button asChild variant="ghost" size="icon" className={`${buttonMotion} rounded-xl`}>
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
  const contentTop = isHome ? "pt-24 md:pt-28" : "pt-28 md:pt-20";
  const shellBackground = isHome
    ? "bg-background bg-[linear-gradient(rgba(35,87,217,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(35,87,217,0.055)_1px,transparent_1px)] [background-position:center_top] [background-size:48px_48px]"
    : "bg-background";

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
