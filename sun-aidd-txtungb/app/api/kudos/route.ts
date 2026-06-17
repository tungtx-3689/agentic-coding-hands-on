import { NextRequest, NextResponse } from "next/server";
import { getKudos } from "@/lib/db/queries/kudos";
import { getSessionUser } from "@/lib/auth/get-session-user";

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const hashtagId = searchParams.get("hashtagId") || null;
  const departmentId = searchParams.get("departmentId") || null;

  const user = await getSessionUser();
  const kudos = await getKudos({
    page,
    pageSize: PAGE_SIZE,
    hashtagId,
    departmentId,
    currentUserId: user?.id ?? null,
  });

  return NextResponse.json(kudos);
}
