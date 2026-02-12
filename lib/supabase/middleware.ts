import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/jerald-portal");
  const isAdminLogin = request.nextUrl.pathname === "/jerald-portal/login";

  if (isAdminRoute && !isAdminLogin && !data.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/jerald-portal/login";
    url.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminLogin && data.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/jerald-portal";
    url.searchParams.delete("from");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
