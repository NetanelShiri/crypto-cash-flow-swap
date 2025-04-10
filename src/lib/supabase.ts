
// This file is deprecated and should not be used.
// Please use the official client from @/integrations/supabase/client instead.

import { supabase as officialClient } from "@/integrations/supabase/client";

// Re-export the official client
export const supabase = officialClient;

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return true; // Since we're using the official client, it's always configured
};

console.warn(
  'The supabase client in src/lib/supabase.ts is deprecated. Please import from "@/integrations/supabase/client" instead.'
);
