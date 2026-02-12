import Image from "next/image";
import Link from "next/link";
import { getPortfolioContent } from "@/lib/portfolio";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { GalleryCarousel } from "@/app/components/GalleryCarousel";
import { HoverProfileImage } from "@/app/components/HoverProfileImage";
import {
  IconPin,
  IconCalendar,
  IconMail,
  IconDocument,
  IconArrowRight,
  IconCheck,
  IconBriefcase,
  IconCog,
} from "@/app/components/Icons";

export default async function Home() {
  const c = await getPortfolioContent();
  const { hero, about, experience, techStack, beyondCoding, projects, certifications, recommendations, associations, socialLinks, contact, gallery } = c;

  // Tagline with vertical separators: "AI \\ Software \\ Content" → "AI | Software | Content"
  const taglineParts = hero.tagline.split(/\\+/).map((s) => s.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <main className="max-w-5xl mx-auto px-5 sm:px-6 pt-2 sm:pt-3 pb-10 sm:pb-14">
        {/* Top right: theme toggle */}
        <div className="flex justify-end mb-3 sm:mb-4">
          <ThemeToggle />
        </div>

        {/* Hero full-width at top */}
        <section className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 mb-6 sm:mb-8">
          <HoverProfileImage
            src={hero.image}
            hoverSrc="/jerald2.png"
            alt={hero.name}
          />
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2 flex-wrap">
              {hero.name}
              <span className="text-blue-600 dark:text-blue-400" aria-hidden>
                <IconCheck className="w-5 h-5" />
              </span>
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              <IconPin className="w-4 h-4 shrink-0" />
              {hero.location}
            </p>
            {taglineParts.length > 0 && (
              <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
                {taglineParts.join(" | ")}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4">
              <Link
                href={hero.ctaPrimaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <IconCalendar className="w-4 h-4" />
                {hero.ctaPrimary}
                <IconArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <IconMail className="w-4 h-4" />
                {hero.ctaEmail}
              </Link>
              <Link
                href={hero.ctaBlogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <IconDocument className="w-4 h-4" />
                {hero.ctaBlog}
                <IconArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* About + Experience side by side at top */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 sm:mb-5">
          {/* About - Left */}
          <section className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <IconBriefcase className="w-4 h-4 text-zinc-500" />
              {about.title}
            </h2>
            <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          {/* Right column: Banner + Experience */}
          <div className="flex-1 space-y-4">
            {/* Banner */}
            {(hero.bannerTitle ?? "") && (
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <Link
                  href={hero.bannerUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-br from-violet-700 to-zinc-900 dark:from-violet-800 dark:to-zinc-950 text-white p-5 hover:opacity-95 transition-opacity"
                >
                  <p className="text-lg font-bold tracking-tight">{hero.bannerTitle}</p>
                  {hero.bannerSubline && (
                    <p className="text-sm text-white/90 mt-1">{hero.bannerSubline}</p>
                  )}
                </Link>
              </div>
            )}

            {/* Experience */}
            <section className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <IconBriefcase className="w-4 h-4 text-zinc-500" />
                {experience.title}
              </h2>
              <ul className="relative space-y-0 border-l-2 border-zinc-200 dark:border-zinc-700 pl-5">
                {experience.items.map((item, i) => (
                  <li key={i} className="relative pb-4 last:pb-0">
                    <span
                      className={`absolute left-0 w-2.5 h-2.5 rounded-full -translate-x-[calc(0.5rem+3px)] mt-1.5 ${i === 0
                          ? "bg-zinc-900 dark:bg-zinc-100"
                          : "border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                        }`}
                    />
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                          {item.role}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">{item.org}</p>
                      </div>
                      <span className="text-sm text-zinc-500 dark:text-zinc-500 shrink-0">
                        {item.year}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* Tech Stack + Beyond Coding/Projects row */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 sm:mb-5">
          {/* Tech Stack - Left */}
          <section className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <IconCog className="w-4 h-4 text-zinc-500" />
                {techStack.title}
              </h2>
              {techStack.viewAllUrl && (
                <Link
                  href={techStack.viewAllUrl}
                  className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 inline-flex items-center gap-1"
                >
                  View All
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
            <div className="space-y-5">
              {techStack.categories.map((cat, i) => (
                <div key={i}>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-2.5">{cat.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((item, j) => (
                      <span
                        key={j}
                        className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/50 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right column: Beyond Coding + Recent Projects stacked */}
          <div className="flex-1 space-y-4">
            {/* Beyond Coding */}
            <section className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5">
              <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-3">
                {beyondCoding.title}
              </h2>
              <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {beyondCoding.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>

            {/* Recent Projects */}
            {projects.items.length > 0 && (
              <section className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                    <IconDocument className="w-4 h-4 text-zinc-500" />
                    {projects.title}
                  </h2>
                  {projects.viewAllUrl && (
                    <Link
                      href={projects.viewAllUrl}
                      className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 inline-flex items-center gap-1"
                    >
                      View All
                      <IconArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {projects.items.slice(0, 4).map((item, i) => (
                    <Link
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-2.5 sm:p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">{item.title}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Certifications + Recommendations side by side */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6">
          <section className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                {certifications.title}
              </h2>
              {certifications.viewAllUrl && (
                <Link href={certifications.viewAllUrl} className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 inline-flex items-center gap-1">
                  View all
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
            <ul className="space-y-4">
              {certifications.items.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-2"
                  >
                    {item.title}
                  </Link>
                  <span className="text-zinc-500 dark:text-zinc-500 text-sm"> — {item.issuer}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
            <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-5">
              {recommendations.title}
            </h2>
            <ul className="space-y-6">
              {recommendations.items.map((item, i) => (
                <li key={i} className="text-sm">
                  <p className="text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-500 mt-2">
                    {item.author}, {item.role}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Associations/Social + Contact side by side */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
          {(associations.length > 0 || socialLinks.length > 0) && (
            <section className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {associations.length > 0 && (
                <div>
                  <span className="text-zinc-500 dark:text-zinc-500">Member of </span>
                  {associations.map((item, i) => (
                    <Link
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-700 dark:text-zinc-300 hover:underline underline-offset-2"
                    >
                      {item.name}
                      {i < associations.length - 1 ? ", " : ""}
                    </Link>
                  ))}
                </div>
              )}
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-x-4">
                  {socialLinks.map((item, i) => (
                    <Link
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-600 dark:text-zinc-400 hover:underline underline-offset-2"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}

          <section className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{contact.speakingText}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <Link href={`mailto:${contact.email}`} className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-2">
                {contact.email}
              </Link>
              <Link href={contact.calendlyUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:underline underline-offset-2">
                Schedule a call
              </Link>
              <Link href={contact.blogUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:underline underline-offset-2">
                Blog
              </Link>
            </div>
          </section>
        </div>

        {/* Gallery Carousel */}
        <GalleryCarousel images={gallery.images} title={gallery.title} />

        <footer className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400 dark:text-zinc-500">
          <p>© 2026 Jerald Babor. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
