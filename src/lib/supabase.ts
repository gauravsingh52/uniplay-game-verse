
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Please check your .env file or Lovable secrets.'
  );
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Add this check to help with debugging
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'IMPORTANT: Supabase client was initialized with placeholder values. Authentication will not work correctly until proper environment variables are provided.'
  );
}
