"use server";

import { createSupabaseServerClientWithCookies } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createSupabaseServerClientWithCookies();
  await supabase.auth.signOut();
  redirect("/login");
}
