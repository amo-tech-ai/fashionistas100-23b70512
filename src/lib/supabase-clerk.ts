import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@clerk/clerk-react'
import { useMemo } from 'react'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Hook that creates Supabase client with Clerk token
export function useSupabase() {
  const { getToken } = useAuth()
  
  const client = useMemo(
    () => createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: async (url, options: RequestInit = {}) => {
          const token = await getToken()
          const headers = new Headers(options?.headers)
          headers.set('Authorization', token ? `Bearer ${token}` : '')
          return fetch(url, { ...options, headers })
        },
      },
    }),
    [getToken]
  )
  
  return client
}