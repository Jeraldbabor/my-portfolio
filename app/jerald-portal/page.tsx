import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/jerald-portal/login");

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="max-w-2xl mx-auto px-5 py-6 flex items-center justify-between">
        <span className="text-sm font-medium">Admin</span>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/" className="text-zinc-500 hover:underline underline-offset-2">
            View site
          </Link>
          <form action="/jerald-portal/logout" method="post">
            <button type="submit" className="text-zinc-500 hover:underline underline-offset-2">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-5 py-12">
        <Link
          href="/jerald-portal/dashboard"
          className="text-sm text-zinc-700 dark:text-zinc-300 hover:underline underline-offset-2"
        >
          Edit portfolio content →
        </Link>
      </main>
    </div>
  );
}
