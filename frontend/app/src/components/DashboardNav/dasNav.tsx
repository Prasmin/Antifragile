
import { signOut } from "@/app/auth/actions";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";


const DasNav = ({ user }: { user: User | null }) => {
  if (!user) return null;
  
  return(

    //  Header with profile
    <header className="mx-auto max-w-9xl py-4  ">

        <section className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
          <h1 className="sm:text-3xl text-xl font-bold text-white">
            Antifragile Dashboard
          </h1>
          <p className="mt-2 text-slate-300 sm:text-lg text-sm">
            Your personal hub for growth, decision‑making and clarity.
          </p>
          <div className="mt-6 flex items-center gap-4">
            {user.user_metadata?.avatar_url && (
              <Image
                src={user.user_metadata.avatar_url}
                alt="Profile"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full border border-white/20"
                />
            )}
            <div>
              <p className="font-medium text-white">
                {user.user_metadata?.full_name || user.email}
              </p>
              <p className="sm:text-sm text-xs text-slate-400">{user.email}</p>
            </div>
            <form action={signOut} className="ml-auto">
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 cursor-pointer"
              >
                Sign out
              </button>
            </form>
          </div>
        </section> 


                </header>
  ) ;
}

export default DasNav;