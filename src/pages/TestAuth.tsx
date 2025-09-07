import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useSupabase } from '@/lib/supabase-clerk'

export default function TestAuth() {
  const { user } = useUser()
  const supabase = useSupabase()
  const [result, setResult] = useState<string>('Testing...')
  
  useEffect(() => {
    async function test() {
      if (!user) {
        setResult('Not signed in')
        return
      }
      
      try {
        // Test auth.jwt() to see if Clerk token is passed
        const { data, error } = await supabase.rpc('get_clerk_user_id')
        
        if (error) {
          // Try a simple query instead
          const { data: events, error: queryError } = await supabase
            .from('events')
            .select('id')
            .limit(1)
          
          if (queryError) {
            setResult(`Error: ${queryError.message}`)
          } else {
            setResult(`✅ Connected! Found ${events?.length || 0} events. User: ${user.id}`)
          }
        } else {
          setResult(`✅ Clerk ID from Supabase: ${data}`)
        }
      } catch (err) {
        setResult(`Error: ${err}`)
      }
    }
    
    test()
  }, [user, supabase])
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Clerk + Supabase Test</h1>
      <p className="mb-2">Clerk User: {user?.id || 'Not signed in'}</p>
      <p className="mb-2">Email: {user?.primaryEmailAddress?.emailAddress || 'N/A'}</p>
      <p className="text-lg font-semibold">{result}</p>
    </div>
  )
}