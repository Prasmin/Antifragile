import { createClient } from "@/lib/supabase/server";
import GoogleLoginDemo from "./GoogleLoginDemo";

import { redirect } from "next/navigation";

export default async function GoogleLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
 console.log("User in login page:", user);

  // Redirect authenticated users to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return <GoogleLoginDemo user={user} />;
}
