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
    <div className=" min-h-screen flex items-center justify-center mx-auto sm:p-4 p-2 max-w-7xl "> 
      
      
        
        
          <DashboardCardList />
         
       
      
    </div>
  );
}
