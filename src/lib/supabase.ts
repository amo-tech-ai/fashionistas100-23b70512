import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useMemo, useState } from 'react'
import type { Database } from '@/integrations/supabase/types'

const SUPABASE_URL = "https://vuvfqjhkppmbdeqsflbn.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxODA4NTQsImV4cCI6MjA3MTc1Njg1NH0.9CQrGMuLuK6DWlRe7Z8tOrNBjEBEPnj9-AsBO3x8zKc"

// Client-side hook
export function useSupabase() {
  const { session } = useAuth()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // For Supabase auth, we can use the session access_token directly
    if (session?.access_token) {
      setToken(session.access_token)
    } else {
      setToken(null)
    }
  }, [session])

  const client = useMemo(() => {
    const headers: Record<string, string> = token
      ? { Authorization: `Bearer ${token}` }
      : {}
    return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers },
    })
  }, [token])

  return client
}

// Server-side function for API routes
export async function createServerSupabaseClient(
  getToken: () => Promise<string | null>
) {
  const token = await getToken()
  const headers: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {}
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers },
  })
}
