import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { getSafeRedirectPath } from "@/lib/auth/redirect";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    mode?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = getSafeRedirectPath(params.next);
  const initialMode = params.mode === "register" ? "register" : "login";

  return (
    <main
      className="flex min-h-svh flex-col bg-cover bg-center bg-no-repeat text-foreground"
      style={{ backgroundImage: "url('/bg.webp')" }}
    >
      <header className="mx-auto flex w-full max-w-7xl shrink-0 items-center justify-between px-6 py-4 sm:px-8 sm:py-5 lg:px-10">
        <Link
          href="/"
          aria-label="QuantLearn home"
          className="text-2xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
        >
          <span className="text-foreground">Quant</span>
          <span className="text-primary">Learn</span>
        </Link>

        <Button
          asChild
          variant="outline"
          className="rounded-full border-primary/30 bg-white/40 text-primary shadow-sm hover:bg-white/70 hover:text-primary"
        >
          <Link href="/">
            <ArrowLeft className="size-4" />
            Home
          </Link>
        </Button>
      </header>

      <section className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 sm:py-12">
        <LoginForm
          initialError={params.error}
          initialMode={initialMode}
          nextPath={nextPath}
        />
      </section>
    </main>
  );
}
