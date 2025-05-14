
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if variables exist before creating client
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Please check your Lovable project secrets.'
  );
}

// Create a more robust Supabase client that won't try to connect if credentials missing
export const supabase = !supabaseUrl || !supabaseAnonKey 
  ? null 
  : createClient(supabaseUrl, supabaseAnonKey);

// Modify the main.tsx file to show an error message if Supabase is not configured
