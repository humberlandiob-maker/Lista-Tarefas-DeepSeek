import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://joaolmubsfxjlwperwey.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvYW9sbXVic2Z4amx3cGVyd2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMDY2NzQsImV4cCI6MjA5Njg4MjY3NH0.aGU0h-IY67cD19FxeH7TonSN_NwbF8pPZT42oEyCraQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
