import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPortfolioContent } from "@/lib/portfolio";
import { defaultPortfolioContent } from "@/lib/types/portfolio";
import AdminContentEditor from "@/app/jerald-portal/dashboard/AdminContentEditor";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/jerald-portal/login");

  let content;
  try {
    content = await getPortfolioContent();
  } catch {
    content = defaultPortfolioContent;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="max-w-2xl mx-auto px-5 py-6 flex items-center justify-between">
        <span className="text-sm font-medium">Edit content</span>
        <div className="flex items-center gap-5 text-sm">
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:underline underline-offset-2">
            View site
          </a>
          <a href="/jerald-portal" className="text-zinc-500 hover:underline underline-offset-2">
            ← Admin
          </a>
          <form action="/jerald-portal/logout" method="post">
            <button type="submit" className="text-zinc-500 hover:underline underline-offset-2">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-5 py-8">
        <AdminContentEditor initialContent={content} />
      </main>
    </div>
  );
}
