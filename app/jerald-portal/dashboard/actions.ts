"use server";

import { updatePortfolioContent } from "@/lib/portfolio";
import type { PortfolioContent } from "@/lib/types/portfolio";

export async function saveContent(content: Partial<PortfolioContent>) {
  const { error } = await updatePortfolioContent(content);
  return { error: error?.message ?? null };
}
