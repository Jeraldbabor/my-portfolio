"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/jerald-portal";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push(from);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-xs">
        <h1 className="text-lg font-normal text-center mb-8">
          Admin
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="email" className="block text-xs text-zinc-500 dark:text-zinc-500 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border-b border-zinc-300 dark:border-zinc-600 bg-transparent px-0 py-2 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs text-zinc-500 dark:text-zinc-500 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border-b border-zinc-300 dark:border-zinc-600 bg-transparent px-0 py-2 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-2 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="text-center mt-6 text-xs text-zinc-500">
          <Link href="/" className="hover:underline underline-offset-2">
            ← Back
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-sm text-zinc-500">Loading…</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
