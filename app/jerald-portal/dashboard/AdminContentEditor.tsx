"use client";

import { useState } from "react";
import { saveContent } from "./actions";
import type { PortfolioContent } from "@/lib/types/portfolio";

export default function AdminContentEditor({
  initialContent,
}: {
  initialContent: PortfolioContent;
}) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Local state for list-based inputs to avoid cursor jumping and double-pipe issues
  const [experienceText, setExperienceText] = useState(
    initialContent.experience.items.map((i) => `${i.role}|${i.org}|${i.year}`).join("\n")
  );
  const [techStackText, setTechStackText] = useState(
    initialContent.techStack.categories.map((c) => `${c.name}|${c.items.join(", ")}`).join("\n")
  );
  const [beyondCodingText, setBeyondCodingText] = useState(
    initialContent.beyondCoding.paragraphs.join("\n")
  );
  const [projectsText, setProjectsText] = useState(
    initialContent.projects.items.map((i) => `${i.title}|${i.description}|${i.url}`).join("\n")
  );
  const [certificationsText, setCertificationsText] = useState(
    initialContent.certifications.items.map((i) => `${i.title}|${i.issuer}|${i.url}`).join("\n")
  );
  const [recommendationsText, setRecommendationsText] = useState(
    initialContent.recommendations.items.map((i) => `${i.quote}\n${i.author}\n${i.role}`).join("\n---\n")
  );
  const [associationsText, setAssociationsText] = useState(
    initialContent.associations.map((a) => `${a.name}|${a.url}`).join("\n")
  );
  const [socialLinksText, setSocialLinksText] = useState(
    initialContent.socialLinks.map((s) => `${s.name}|${s.url}`).join("\n")
  );
  const [galleryText, setGalleryText] = useState(
    initialContent.gallery.images.map((i) => `${i.src}|${i.alt}`).join("\n")
  );

  async function handleSave(section: keyof PortfolioContent, partial: Partial<PortfolioContent>) {
    setSaving(section);
    setMessage(null);
    const { error } = await saveContent(partial);
    setSaving(null);
    if (error) {
      setMessage({ type: "err", text: error });
    } else {
      setContent((c) => ({ ...c, ...partial }));
      setMessage({ type: "ok", text: "Saved." });
    }
  }

  return (
    <div className="space-y-10">
      {message && (
        <p className={`text-xs ${message.type === "ok" ? "text-zinc-500" : "text-red-600 dark:text-red-400"}`}>
          {message.text}
        </p>
      )}

      {/* Hero */}
      <Section title="Hero">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Name"
            value={content.hero.name}
            onChange={(v) =>
              setContent((c) => ({ ...c, hero: { ...c.hero, name: v } }))
            }
          />
          <Input
            label="Location"
            value={content.hero.location}
            onChange={(v) =>
              setContent((c) => ({ ...c, hero: { ...c.hero, location: v } }))
            }
          />
          <Input
            label="Tagline (use \\ for newline)"
            value={content.hero.tagline}
            onChange={(v) =>
              setContent((c) => ({ ...c, hero: { ...c.hero, tagline: v } }))
            }
          />
          <Input
            label="Hero image path"
            value={content.hero.image}
            onChange={(v) =>
              setContent((c) => ({ ...c, hero: { ...c.hero, image: v } }))
            }
          />
          <Input
            label="Badge text"
            value={content.hero.badgeText}
            onChange={(v) =>
              setContent((c) => ({ ...c, hero: { ...c.hero, badgeText: v } }))
            }
          />
          <Input
            label="Badge URL"
            value={content.hero.badgeUrl}
            onChange={(v) =>
              setContent((c) => ({ ...c, hero: { ...c.hero, badgeUrl: v } }))
            }
          />
          <Input
            label="CTA Primary text"
            value={content.hero.ctaPrimary}
            onChange={(v) =>
              setContent((c) => ({ ...c, hero: { ...c.hero, ctaPrimary: v } }))
            }
          />
          <Input
            label="CTA Primary URL"
            value={content.hero.ctaPrimaryUrl}
            onChange={(v) =>
              setContent((c) => ({
                ...c,
                hero: { ...c.hero, ctaPrimaryUrl: v },
              }))
            }
          />
          <Input
            label="CTA Email text"
            value={content.hero.ctaEmail}
            onChange={(v) =>
              setContent((c) => ({ ...c, hero: { ...c.hero, ctaEmail: v } }))
            }
          />
          <Input
            label="CTA Blog text"
            value={content.hero.ctaBlog}
            onChange={(v) =>
              setContent((c) => ({ ...c, hero: { ...c.hero, ctaBlog: v } }))
            }
          />
          <Input
            label="CTA Blog URL"
            value={content.hero.ctaBlogUrl}
            onChange={(v) =>
              setContent((c) => ({ ...c, hero: { ...c.hero, ctaBlogUrl: v } }))
            }
          />
          <Input
            label="Banner title (e.g. I'm part of PH100)"
            value={content.hero.bannerTitle ?? ""}
            onChange={(v) =>
              setContent((c) => ({ ...c, hero: { ...c.hero, bannerTitle: v } }))
            }
          />
          <Input
            label="Banner subline"
            value={content.hero.bannerSubline ?? ""}
            onChange={(v) =>
              setContent((c) => ({ ...c, hero: { ...c.hero, bannerSubline: v } }))
            }
          />
          <Input
            label="Banner URL"
            value={content.hero.bannerUrl ?? ""}
            onChange={(v) =>
              setContent((c) => ({ ...c, hero: { ...c.hero, bannerUrl: v } }))
            }
          />
        </div>
        <SaveBtn
          saving={saving === "hero"}
          onSave={() => handleSave("hero", { hero: content.hero })}
        />
      </Section>

      {/* About */}
      <Section title="About">
        <Input
          label="Title"
          value={content.about.title}
          onChange={(v) =>
            setContent((c) => ({ ...c, about: { ...c.about, title: v } }))
          }
        />
        <Textarea
          label="Paragraphs (one per line)"
          value={content.about.paragraphs.join("\n")}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              about: {
                ...c.about,
                paragraphs: v.split("\n"),
              },
            }))
          }
        />
        <SaveBtn
          saving={saving === "about"}
          onSave={() => handleSave("about", { about: content.about })}
        />
      </Section>

      {/* Experience */}
      <Section title="Experience">
        <Input
          label="Section title"
          value={content.experience.title}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              experience: { ...c.experience, title: v },
            }))
          }
        />
        <p className="text-sm text-zinc-500 mb-2">
          One item per line: Role | Org | Year
        </p>
        <Textarea
          value={experienceText}
          onChange={setExperienceText}
        />
        <SaveBtn
          saving={saving === "experience"}
          onSave={() => {
            const items = experienceText
              .split("\n")
              .map((line) => {
                const [role = "", org = "", year = ""] = line.split("|");
                return { role: role.trim(), org: org.trim(), year: year.trim() };
              })
              .filter((i) => i.role || i.org || i.year);
            handleSave("experience", { experience: { ...content.experience, items } });
          }}
        />
      </Section>

      {/* Tech Stack */}
      <Section title="Tech Stack">
        <Input
          label="Title"
          value={content.techStack.title}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              techStack: { ...c.techStack, title: v },
            }))
          }
        />
        <Input
          label="View All URL"
          value={content.techStack.viewAllUrl}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              techStack: { ...c.techStack, viewAllUrl: v },
            }))
          }
        />
        <p className="text-sm text-zinc-500 mb-2">
          Categories: one per line, format: Category name | item1, item2, item3
        </p>
        <Textarea
          value={techStackText}
          onChange={setTechStackText}
        />
        <SaveBtn
          saving={saving === "techStack"}
          onSave={() => {
            const categories = techStackText
              .split("\n")
              .map((line) => {
                const [name = "", rest = ""] = line.split("|");
                return {
                  name: name.trim(),
                  items: rest.split(",").map((s) => s.trim()).filter(Boolean),
                };
              })
              .filter((c) => c.name || c.items.length > 0);
            handleSave("techStack", { techStack: { ...content.techStack, categories } });
          }}
        />
      </Section>

      {/* Beyond Coding */}
      <Section title="Beyond Coding">
        <Input
          label="Title"
          value={content.beyondCoding.title}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              beyondCoding: { ...c.beyondCoding, title: v },
            }))
          }
        />
        <Textarea
          label="Paragraphs (one per line)"
          value={beyondCodingText}
          onChange={setBeyondCodingText}
        />
        <SaveBtn
          saving={saving === "beyondCoding"}
          onSave={() => {
            const paragraphs = beyondCodingText.split("\n").filter((p) => p.trim());
            handleSave("beyondCoding", { beyondCoding: { ...content.beyondCoding, paragraphs } });
          }}
        />
      </Section>

      {/* Projects */}
      <Section title="Recent Projects">
        <Input
          label="Title"
          value={content.projects.title}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              projects: { ...c.projects, title: v },
            }))
          }
        />
        <Input
          label="View All URL"
          value={content.projects.viewAllUrl}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              projects: { ...c.projects, viewAllUrl: v },
            }))
          }
        />
        <p className="text-sm text-zinc-500 mb-2">
          One per line: Title | Description | URL
        </p>
        <Textarea
          value={projectsText}
          onChange={setProjectsText}
        />
        <SaveBtn
          saving={saving === "projects"}
          onSave={() => {
            const items = projectsText
              .split("\n")
              .map((line) => {
                const [title = "", description = "", url = ""] = line.split("|");
                return {
                  title: title.trim(),
                  description: description.trim(),
                  url: url.trim(),
                };
              })
              .filter((i) => i.title || i.description || i.url);
            handleSave("projects", { projects: { ...content.projects, items } });
          }}
        />
      </Section>

      {/* Certifications */}
      <Section title="Certifications">
        <Input
          label="Title"
          value={content.certifications.title}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              certifications: { ...c.certifications, title: v },
            }))
          }
        />
        <Input
          label="View All URL"
          value={content.certifications.viewAllUrl}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              certifications: { ...c.certifications, viewAllUrl: v },
            }))
          }
        />
        <p className="text-sm text-zinc-500 mb-2">
          One per line: Title | Issuer | URL
        </p>
        <Textarea
          value={certificationsText}
          onChange={setCertificationsText}
        />
        <SaveBtn
          saving={saving === "certifications"}
          onSave={() => {
            const items = certificationsText
              .split("\n")
              .map((line) => {
                const [title = "", issuer = "", url = ""] = line.split("|");
                return {
                  title: title.trim(),
                  issuer: issuer.trim(),
                  url: url.trim(),
                };
              })
              .filter((i) => i.title || i.issuer || i.url);
            handleSave("certifications", { certifications: { ...content.certifications, items } });
          }}
        />
      </Section>

      {/* Recommendations */}
      <Section title="Recommendations">
        <Input
          label="Section title"
          value={content.recommendations.title}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              recommendations: { ...c.recommendations, title: v },
            }))
          }
        />
        <p className="text-sm text-zinc-500 mb-2">
          One per block (separated by ---): Quote | Author | Role
        </p>
        <Textarea
          value={recommendationsText}
          onChange={setRecommendationsText}
        />
        <SaveBtn
          saving={saving === "recommendations"}
          onSave={() => {
            const blocks = recommendationsText.split("\n---\n").filter(Boolean);
            const items = blocks.map((block) => {
              const [quote = "", author = "", role = ""] = block.split("\n");
              return {
                quote: quote.trim(),
                author: author.trim(),
                role: role.trim(),
              };
            });
            handleSave("recommendations", { recommendations: { ...content.recommendations, items } });
          }}
        />
      </Section>

      {/* Contact */}
      <Section title="Contact">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Email"
            value={content.contact.email}
            onChange={(v) =>
              setContent((c) => ({
                ...c,
                contact: { ...c.contact, email: v },
              }))
            }
          />
          <Input
            label="Calendly URL"
            value={content.contact.calendlyUrl}
            onChange={(v) =>
              setContent((c) => ({
                ...c,
                contact: { ...c.contact, calendlyUrl: v },
              }))
            }
          />
          <Input
            label="Blog URL"
            value={content.contact.blogUrl}
            onChange={(v) =>
              setContent((c) => ({
                ...c,
                contact: { ...c.contact, blogUrl: v },
              }))
            }
          />
          <Textarea
            label="Speaking text"
            value={content.contact.speakingText}
            onChange={(v) =>
              setContent((c) => ({
                ...c,
                contact: { ...c.contact, speakingText: v },
              }))
            }
          />
        </div>
        <SaveBtn
          saving={saving === "contact"}
          onSave={() => handleSave("contact", { contact: content.contact })}
        />
      </Section>

      {/* Associations */}
      <Section title="Associations">
        <p className="text-sm text-zinc-500 mb-2">One per line: Name | URL</p>
        <Textarea
          value={associationsText}
          onChange={setAssociationsText}
        />
        <SaveBtn
          saving={saving === "associations"}
          onSave={() => {
            const associations = associationsText
              .split("\n")
              .map((line) => {
                const [name = "", url = ""] = line.split("|");
                return { name: name.trim(), url: url.trim() };
              })
              .filter((a) => a.name || a.url);
            handleSave("associations", { associations });
          }}
        />
      </Section>

      {/* Social Links */}
      <Section title="Social Links">
        <p className="text-sm text-zinc-500 mb-2">One per line: Name | URL</p>
        <Textarea
          value={socialLinksText}
          onChange={setSocialLinksText}
        />
        <SaveBtn
          saving={saving === "socialLinks"}
          onSave={() => {
            const socialLinks = socialLinksText
              .split("\n")
              .map((line) => {
                const [name = "", url = ""] = line.split("|");
                return { name: name.trim(), url: url.trim() };
              })
              .filter((s) => s.name || s.url);
            handleSave("socialLinks", { socialLinks });
          }}
        />
      </Section>

      {/* Gallery */}
      <Section title="Gallery">
        <Input
          label="Section title"
          value={content.gallery.title}
          onChange={(v) =>
            setContent((c) => ({
              ...c,
              gallery: { ...c.gallery, title: v },
            }))
          }
        />
        <p className="text-sm text-zinc-500 mb-2">
          One per line: Image path | Alt text
        </p>
        <Textarea
          value={galleryText}
          onChange={setGalleryText}
        />
        <SaveBtn
          saving={saving === "gallery"}
          onSave={() => {
            const images = galleryText
              .split("\n")
              .map((line) => {
                const [src = "", alt = ""] = line.split("|");
                return { src: src.trim(), alt: alt.trim() };
              })
              .filter((i) => i.src || i.alt);
            handleSave("gallery", { gallery: { ...content.gallery, images } });
          }}
        />
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pb-8 border-b border-zinc-200 dark:border-zinc-800 last:border-0 last:pb-0">
      <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 dark:text-zinc-500 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-zinc-200 dark:border-zinc-700 bg-transparent px-0 py-1.5 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      {label && (
        <label className="block text-xs text-zinc-500 dark:text-zinc-500 mb-1">
          {label}
        </label>
      )}
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full border border-zinc-200 dark:border-zinc-700 bg-transparent px-2 py-1.5 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 resize-y"
      />
    </div>
  );
}

function SaveBtn({
  saving,
  onSave,
}: {
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      className="mt-3 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:underline underline-offset-2 disabled:opacity-50"
    >
      {saving ? "Saving…" : "Save"}
    </button>
  );
}
