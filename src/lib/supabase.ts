
import { createClient } from '@supabase/supabase-js';

// Default values for development - these should be replaced with your actual Supabase project values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Check if the URL is valid before creating the client
if (!supabaseUrl || supabaseUrl === 'https://your-project-url.supabase.co') {
  console.error('Warning: Supabase URL is not configured. Please set VITE_SUPABASE_URL in your environment.');
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
  console.error('Warning: Supabase Anon Key is not configured. Please set VITE_SUPABASE_ANON_KEY in your environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://your-project-url.supabase.co' && 
         supabaseAnonKey !== 'your-anon-key';
};
