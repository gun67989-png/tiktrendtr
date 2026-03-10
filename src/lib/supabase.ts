import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabaseServiceKey &&
  supabaseUrl.startsWith("https://") &&
  supabaseServiceKey.length > 20;

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseServiceKey!)
  : null;
