import { auth } from "@/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const session = await auth();
  const path = request.nextUrl.pathname;
  const isAuthRoute =
    path.startsWith("/login") || path.startsWith("/api/auth");

  if (!session?.user && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (session?.user && path === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  return NextResponse.next({ request });
}
