// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://muwtujbivctkmiamdgra.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11d3R1amJpdmN0a21pYW1kZ3JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMzY4MTgsImV4cCI6MjA2MjgxMjgxOH0.bt7XVhuJgCKRAIY3XlEuUMEsI1vGtZog2mxa8rft9fw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);