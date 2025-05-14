
import { createClient } from '@supabase/supabase-js';
import { supabase as integrationClient } from '@/integrations/supabase/client';

// We're using the client from the integrations folder which already has the correct credentials
export const supabase = integrationClient;
