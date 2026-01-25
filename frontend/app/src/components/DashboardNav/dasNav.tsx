import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { redirect } from "next/navigation";
import Image from "next/image";


const DasNav = async () => {
   const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    // Protect route – redirect unauthenticated users to login
    if (!user) {
      redirect("/login");
    }
  
  return(

    //  Header with profile
    <div className=" absolute top-0 z-20  inset-0 p-8">

        <section className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
          <h1 className="text-3xl font-bold text-white">
            Antifragile Dashboard
          </h1>
          <p className="mt-2 text-slate-300">
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
              <p className="text-sm text-slate-400">{user.email}</p>
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


                </div>
  ) ;
}

export default DasNav;