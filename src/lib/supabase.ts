import { useSession } from '@clerk/clerk-react'
import { createClient } from '@supabase/supabase-js'
import { useMemo } from 'react'
import type { Database } from '@/integrations/supabase/types'

const SUPABASE_URL = "https://vuvfqjhkppmbdeqsflbn.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxODA4NTQsImV4cCI6MjA3MTc1Njg1NH0.9CQrGMuLuK6DWlRe7Z8tOrNBjEBEPnj9-AsBO3x8zKc"

// Client-side hook
export function useSupabase() {
  const { session } = useSession()
  
  const client = useMemo(() => {
    return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: async () => {
          const token = await session?.getToken()
          return token ? { Authorization: `Bearer ${token}` } : {}
        }
      }
    })
  }, [session])
  
  return client
}

// Server-side function for API routes
export function createServerSupabaseClient(getToken: () => Promise<string | null>) {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: async () => {
        const token = await getToken()
        return token ? { Authorization: `Bearer ${token}` } : {}
      }
    }
  })
}