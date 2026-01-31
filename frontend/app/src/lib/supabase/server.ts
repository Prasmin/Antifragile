// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// function getEnvironmentVariables() {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//   const supabasePublishableKey =
//     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

//   if (!supabaseUrl || !supabasePublishableKey) {
//     throw new Error(
//       "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
//     );
//   }

//   return { supabaseUrl, supabasePublishableKey };
// }

// /**
//  * Read-only server client for Server Components
//  */
// export async function createSupabaseServerClient() {
//   const { supabaseUrl, supabasePublishableKey } = getEnvironmentVariables();
//   const cookieStore = await cookies();

//   return createServerClient(supabaseUrl, supabasePublishableKey, {
//     cookies: {
//       getAll() {
//         return cookieStore.getAll();
//       },
//     },
//   });
// }

// /**
//  * Server client with cookie mutation support for Route Handlers
//  */
// export async function createSupabaseServerClientWithCookies() {
//   const { supabaseUrl, supabasePublishableKey } = getEnvironmentVariables();
//   const cookieStore = await cookies();

//   return createServerClient(supabaseUrl, supabasePublishableKey, {
//     cookies: {
//       getAll() {
//         return cookieStore.getAll();
//       },
//       setAll(cookiesToSet) {
//         cookiesToSet.forEach(({ name, value, options }) => {
//           cookieStore.set(name, value, options);
//         });
//       },
//     },
//   });
// }


// export async function updateSession(request: NextRequest) {
//   const { supabaseUrl, supabasePublishableKey } = getEnvironmentVariables();

//   let supabaseResponse = NextResponse.next({
//     request,
//   });

//   const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
//     cookies: {
//       getAll() {
//         return request.cookies.getAll();
//       },
//       setAll(cookiesToSet) {
//         cookiesToSet.forEach(({ name, value }) =>
//           request.cookies.set(name, value),
//         );
//         supabaseResponse = NextResponse.next({
//           request,
//         });
//         cookiesToSet.forEach(({ name, value, options }) =>
//           supabaseResponse.cookies.set(name, value, options),
//         );

        

//       },
//     },
//   });

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   return { user, supabaseResponse };
// }


import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function getEnvironmentVariables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  return { supabaseUrl, supabasePublishableKey };
}

/**
 * For Server Components (app/page.tsx, app/layout.tsx, etc.)
 * FIX: Added setAll with try-catch to prevent the warning you saw
 */
export async function createSupabaseServerClient() {
  const { supabaseUrl, supabasePublishableKey } = getEnvironmentVariables();
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      // CRITICAL FIX: Add setAll to prevent the error in RootLayout/DasNav
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components can't set cookies during render, which is expected.
          // The middleware will actually persist these cookies.
          // This just suppresses the "configured without setAll" warning.
        }
      },
    },
  });
}

/**
 * For Route Handlers (app/api/route.ts) and Server Actions (app/actions.ts)
 * This one actually sets cookies for real (doesn't swallow errors)
 */
export async function createSupabaseServerClientWithCookies() {
  const { supabaseUrl, supabasePublishableKey } = getEnvironmentVariables();
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}

/**
 * For Middleware (middleware.ts) - Edge Runtime
 * Handles cookie refresh BEFORE your layout renders
 */
export async function updateSession(request: NextRequest) {
  const { supabaseUrl, supabasePublishableKey } = getEnvironmentVariables();

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Update request cookies for immediate use
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        // Create new response with updated cookies
        response = NextResponse.next({ request });
        // Update response cookies to send to browser
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // This triggers the refresh if needed
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, response };
}