import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-slate-400">Welcome back!</p>

          {user && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-4">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-white">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
              </div>

              <form action={signOut}>
                <button
                  type="submit"
                  className="mt-4 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
