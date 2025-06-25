import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qsvuddnbvuuzpnwofnzy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzdnVkZG5idnV1enBud29mbnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MDE2NzQsImV4cCI6MjA2NjM3NzY3NH0.pBJ-8EOHjiPnnYJHSsYXxu-QH3MEldM0egieWRGnM_o";
export const supabase = createClient(supabaseUrl, supabaseKey);

// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
// const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;
