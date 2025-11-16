import { prisma } from "@/lib/prisma";
import { SiteContent } from "@/types/content";
import { defaultContent } from "@/lib/defaultContent";

export async function getSiteContent(): Promise<SiteContent> {
  const record = await prisma.siteContent.findUnique({ where: { id: 1 } });
  if (!record) return defaultContent;
  return { ...defaultContent, ...(record.data as SiteContent) };
}

export async function updateSiteContent(payload: SiteContent): Promise<void> {
  await prisma.siteContent.upsert({
    where: { id: 1 },
    update: { data: payload },
    create: { id: 1, data: payload }
  });
}
