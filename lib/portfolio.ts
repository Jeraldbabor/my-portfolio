import { createClient } from "@/lib/supabase/server";
import type { PortfolioContent } from "@/lib/types/portfolio";
import { defaultPortfolioContent } from "@/lib/types/portfolio";

export async function getPortfolioContent(): Promise<PortfolioContent> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("portfolio_content")
      .select("content")
      .eq("id", 1)
      .single();

    if (error || !data?.content || Object.keys(data.content as object).length === 0) {
      return defaultPortfolioContent;
    }

    // Manual deep merge to ensure all fields are present even if DB has partial data or old structure
    const dbContent = data.content as Partial<PortfolioContent>;
    const merged: PortfolioContent = {
      hero: { ...defaultPortfolioContent.hero, ...dbContent.hero },
      about: { ...defaultPortfolioContent.about, ...dbContent.about },
      experience: { ...defaultPortfolioContent.experience, ...dbContent.experience },
      techStack: {
        ...defaultPortfolioContent.techStack,
        ...dbContent.techStack,
        // Force /stack if DB has placeholder or empty
        viewAllUrl: (dbContent.techStack?.viewAllUrl === "#" || !dbContent.techStack?.viewAllUrl)
          ? "/stack"
          : dbContent.techStack.viewAllUrl
      },
      beyondCoding: { ...defaultPortfolioContent.beyondCoding, ...dbContent.beyondCoding },
      projects: {
        ...defaultPortfolioContent.projects,
        ...dbContent.projects,
        // Force /projects if DB has placeholder or empty
        viewAllUrl: (dbContent.projects?.viewAllUrl === "#" || !dbContent.projects?.viewAllUrl)
          ? "/projects"
          : dbContent.projects.viewAllUrl
      },
      certifications: { ...defaultPortfolioContent.certifications, ...dbContent.certifications },
      recommendations: { ...defaultPortfolioContent.recommendations, ...dbContent.recommendations },
      associations: dbContent.associations ?? defaultPortfolioContent.associations,
      socialLinks: dbContent.socialLinks ?? defaultPortfolioContent.socialLinks,
      contact: { ...defaultPortfolioContent.contact, ...dbContent.contact },
      gallery: { ...defaultPortfolioContent.gallery, ...dbContent.gallery },
    };

    return merged;
  } catch {
    return defaultPortfolioContent;
  }
}

export async function updatePortfolioContent(
  content: Partial<PortfolioContent>
): Promise<{ error: Error | null }> {
  const supabase = await createClient();
  const current = await getPortfolioContent();
  const merged: PortfolioContent = {
    ...current,
    ...content,
  };

  const { error } = await supabase
    .from("portfolio_content")
    .update({ content: merged, updated_at: new Date().toISOString() })
    .eq("id", 1);

  return { error: error ? new Error(error.message) : null };
}
