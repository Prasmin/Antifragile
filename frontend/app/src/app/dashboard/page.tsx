import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardCardList } from "@/components/Dashboard/card";


export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect route – redirect unauthenticated users to login
  if (!user) {
    redirect("/login");
  }

  return (
    <div className=" min-h-screen flex items-center justify-center p-8  ">
      <div className="relative z-20 mx-auto max-w-5xl space-y-12">
      
        
        
          <DashboardCardList />
         
       
      </div>
    </div>
  );
}
