import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/get-session-user";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({ user });
}
