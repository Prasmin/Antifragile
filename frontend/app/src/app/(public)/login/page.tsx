import GoogleLoginDemo from "./GoogleLoginDemo";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function GoogleLoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
 

  // Redirect authenticated users to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return <GoogleLoginDemo user={user} />;
}
