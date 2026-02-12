import Link from "next/link";
import { getPortfolioContent } from "@/lib/portfolio";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { IconCog, IconArrowRight } from "@/app/components/Icons";

export default async function TechStackPage() {
    const content = await getPortfolioContent();
    const { techStack } = content;

    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <main className="max-w-3xl mx-auto px-5 sm:px-6 pt-8 pb-14">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <Link
                        href="/"
                        className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-2"
                    >
                        <IconArrowRight className="w-4 h-4 rotate-180" />
                        Back to Home
                    </Link>
                    <ThemeToggle />
                </header>

                {/* Title */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <IconCog className="w-6 h-6 text-zinc-500" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Tech Stack</h1>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {techStack.categories.map((cat, i) => (
                        <section
                            key={i}
                            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
                        >
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-4">
                                {cat.name}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {cat.items.map((item, j) => (
                                    <span
                                        key={j}
                                        className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        </div>
    );
}
