import { supabase } from '../supabaseClient';


async function  googleSign(){
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `http://example.com/auth/callback`,
  },
})} 