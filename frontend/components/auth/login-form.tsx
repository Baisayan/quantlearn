"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight, LoaderCircle, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register";

type LoginFormProps = {
  initialError?: string;
  initialMode: AuthMode;
  nextPath: string;
};

export function LoginForm({
  initialError,
  initialMode,
  nextPath,
}: LoginFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(initialError ?? "");
  const [message, setMessage] = useState("");
  const registering = mode === "register";

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const username = String(formData.get("username") ?? "").trim();

    setIsSubmitting(true);
    const supabase = createClient();
    const result = registering
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
            emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(nextPath)}`,
          },
        })
      : await supabase.auth.signInWithPassword({
          email,
          password,
        });

    if (result.error) {
      setError(result.error.message);
      setIsSubmitting(false);
      return;
    }

    if (registering && !result.data.session) {
      setMessage("Account created. Check your email to confirm it, then sign in here.");
      setMode("login");
      setIsSubmitting(false);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md border-white/70 bg-white/65 shadow-2xl shadow-primary/10 backdrop-blur-xl">
      <CardHeader className="space-y-3 px-6 pb-5 pt-7 text-center sm:px-8 sm:pt-8">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <LockKeyhole className="size-6" aria-hidden="true" />
        </span>
        <CardTitle className="text-2xl tracking-tight sm:text-3xl">
          {mode === "login" ? "Welcome back" : "Join QuantLearn"}
        </CardTitle>
        <CardDescription className="text-sm leading-6 sm:text-base">
          {mode === "login"
            ? "Continue your journey through the quantum world."
            : "Create one simple account to save lessons and progress."}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-7 sm:px-8 sm:pb-8">
        <div
          className="grid grid-cols-2 rounded-full bg-secondary/80 p-1"
          role="tablist"
          aria-label="Authentication mode"
        >
          <Button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            variant={mode === "login" ? "default" : "ghost"}
            className="rounded-full"
            onClick={() => changeMode("login")}
          >
            Sign in
          </Button>
          <Button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            variant={mode === "register" ? "default" : "ghost"}
            className="rounded-full"
            onClick={() => changeMode("register")}
          >
            Create account
          </Button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {registering ? (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="quantum_learner"
                minLength={3}
                maxLength={24}
                pattern="[A-Za-z0-9_]+"
                disabled={isSubmitting}
                required
                className="h-11 rounded-xl border-primary/20 bg-white/70"
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              disabled={isSubmitting}
              required
              className="h-11 rounded-xl border-primary/20 bg-white/70"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder="At least 6 characters"
              minLength={6}
              disabled={isSubmitting}
              required
              className="h-11 rounded-xl border-primary/20 bg-white/70"
            />
          </div>

          <div aria-live="polite" className="min-h-6 text-sm leading-6">
            {error ? <p className="text-primary">{error}</p> : null}
            {message ? <p className="text-secondary-foreground">{message}</p> : null}
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full rounded-full text-base shadow-lg shadow-primary/25"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
            ) : null}
            {mode === "login" ? "Sign in" : "Create account"}
            {!isSubmitting ? <ArrowRight className="size-5" aria-hidden="true" /> : null}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
