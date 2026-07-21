import { NextResponse } from "next/server";
import { searchSku } from "@/lib/orchestrator";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sku = searchParams.get("sku")?.trim();

  if (!sku) {
    return NextResponse.json(
      { error: "Missing required 'sku' query parameter." },
      { status: 400 },
    );
  }

  const data = await searchSku(sku);
  return NextResponse.json(data);
}
