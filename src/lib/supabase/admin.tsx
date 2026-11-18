import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const role_Key = process.env.NEXT_SUPABASE_ROLE_KEY!;

if (!url || !role_Key) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_SUPABASE_ROLE_KEY");
}

export const supabaseAdmin = createClient(url, role_Key);
