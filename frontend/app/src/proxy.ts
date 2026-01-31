
// // Middleware to protect dashboard routes – redirects unauthenticated users to /login
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { createSupabaseServerClient } from "@/lib/supabase/server";

// export async function proxy(request: NextRequest) {
//   const supabase = await createSupabaseServerClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   const { pathname } = request.nextUrl;

//   // Protect any route under /dashboard
//   if (pathname.startsWith("/dashboard")) {
//     if (!user) {
//       const url = request.nextUrl.clone();
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: "/dashboard/:path*",
// };


import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/server";

export async function proxy(request: NextRequest) {
  const { user, response } = await updateSession(request);
  
  // Add your auth checks here
  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    return Response.redirect(new URL("/login", request.url));
  }

  return response;
}

// CRITICAL: Match all routes so session is refreshed everywhere
// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

export const config = {
  matcher: "/dashboard/:path*",
};