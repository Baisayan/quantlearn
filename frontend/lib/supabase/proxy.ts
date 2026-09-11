import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = new Set(["/", "/login"]);

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.has(pathname) || pathname === "/auth/confirm";
}

function copyAuthState(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));

  ["cache-control", "expires", "pragma"].forEach((header) => {
    const value = source.headers.get(header);
    if (value) {
      target.headers.set(header, value);
    }
  });

  return target;
}

function createLoginRedirect(request: NextRequest, response: NextResponse) {
  const loginUrl = request.nextUrl.clone();
  const requestedPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", requestedPath);

  return copyAuthState(response, NextResponse.redirect(loginUrl));
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const publicPath = isPublicPath(pathname);

  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, options, value }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
          Object.entries(headers).forEach(([name, value]) => {
            supabaseResponse.headers.set(name, value);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.getClaims();
  const authenticated = !error && Boolean(data?.claims?.sub);

  if (!authenticated && !publicPath) {
    return createLoginRedirect(request, supabaseResponse);
  }

  if (authenticated && pathname === "/login") {
    const learnUrl = request.nextUrl.clone();
    learnUrl.pathname = "/learn";
    learnUrl.search = "";
    return copyAuthState(supabaseResponse, NextResponse.redirect(learnUrl));
  }

  return supabaseResponse;
}
