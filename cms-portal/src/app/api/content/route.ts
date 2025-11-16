import { NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/contentService";
import { SiteContent } from "@/types/content";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const data = await getSiteContent();
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  const userId = await requireAuth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const payload = (await request.json()) as SiteContent;
  await updateSiteContent(payload);
  return NextResponse.json({ message: "updated" });
}
