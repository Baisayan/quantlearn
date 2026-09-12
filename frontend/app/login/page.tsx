import { LoginForm } from "@/components/auth/login-form";
export default function LoginPage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <section className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 sm:py-12">
        <LoginForm />
      </section>
    </main>
  );
}
