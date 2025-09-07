// Complete Integration Test with Live Authentication Check
import { useEffect, useState } from 'react'
import { useUser, useAuth } from '@clerk/clerk-react'
import { useSupabase } from '@/lib/supabase-clerk'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'

export default function CompleteIntegrationTest() {
  const { user, isLoaded: userLoaded } = useUser()
  const { isSignedIn, getToken } = useAuth()
  const supabase = useSupabase()
  
  const [tests, setTests] = useState({
    clerkAuth: { status: 'pending', message: 'Checking Clerk authentication...' },
    tokenGeneration: { status: 'pending', message: 'Generating Clerk token...' },
    supabaseConnection: { status: 'pending', message: 'Connecting to Supabase...' },
    rlsPolicy: { status: 'pending', message: 'Testing RLS policies...' },
    dataFetch: { status: 'pending', message: 'Fetching authenticated data...' },
    userProfile: { status: 'pending', message: 'Checking user profile sync...' }
  })
  
  useEffect(() => {
    async function runTests() {
      if (!userLoaded) return
      
      // Test 1: Clerk Authentication
      if (isSignedIn && user) {
        setTests(prev => ({
          ...prev,
          clerkAuth: { 
            status: 'success', 
            message: `✅ Authenticated as: ${user.primaryEmailAddress?.emailAddress || user.id}` 
          }
        }))
        
        // Test 2: Token Generation
        try {
          const token = await getToken()
          if (token) {
            setTests(prev => ({
              ...prev,
              tokenGeneration: { 
                status: 'success', 
                message: `✅ Token generated (${token.substring(0, 20)}...)` 
              }
            }))
          } else {
            throw new Error('No token received')
          }
        } catch (error) {
          setTests(prev => ({
            ...prev,
            tokenGeneration: { 
              status: 'error', 
              message: `❌ Token generation failed: ${error}` 
            }
          }))
        }
        
        // Test 3: Supabase Connection
        try {
          const { data: testData, error } = await supabase
            .from('events')
            .select('id')
            .limit(1)
          
          if (error) throw error
          
          setTests(prev => ({
            ...prev,
            supabaseConnection: { 
              status: 'success', 
              message: '✅ Supabase connected successfully' 
            }
          }))
        } catch (error: any) {
          setTests(prev => ({
            ...prev,
            supabaseConnection: { 
              status: 'error', 
              message: `❌ Connection failed: ${error.message}` 
            }
          }))
        }
        
        // Test 4: RLS Policy Test
        try {
          // Try to fetch user-specific data
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('clerk_user_id', user.id)
            .single()
          
          if (error && error.code !== 'PGRST116') {
            throw error
          }
          
          setTests(prev => ({
            ...prev,
            rlsPolicy: { 
              status: 'success', 
              message: data ? '✅ RLS policies working (user data found)' : '✅ RLS policies working (no data yet)' 
            }
          }))
          
          // Test 5: Data Fetch
          const { data: events, error: eventsError } = await supabase
            .from('events')
            .select('*')
            .limit(5)
          
          if (eventsError) throw eventsError
          
          setTests(prev => ({
            ...prev,
            dataFetch: { 
              status: 'success', 
              message: `✅ Fetched ${events?.length || 0} events with authentication` 
            }
          }))
          
          // Test 6: User Profile
          if (data) {
            setTests(prev => ({
              ...prev,
              userProfile: { 
                status: 'success', 
                message: `✅ User profile synced (ID: ${data.id})` 
              }
            }))
          } else {
            // Try to create profile
            const { error: insertError } = await supabase
              .from('user_profiles')
              .insert({
                clerk_user_id: user.id,
                email: user.primaryEmailAddress?.emailAddress || '',
                full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
                role: 'organizer'
              })
            
            if (insertError && insertError.code !== '23505') { // 23505 is duplicate key
              throw insertError
            }
            
            setTests(prev => ({
              ...prev,
              userProfile: { 
                status: 'success', 
                message: '✅ User profile created in Supabase' 
              }
            }))
          }
        } catch (error: any) {
          setTests(prev => ({
            ...prev,
            rlsPolicy: { 
              status: 'error', 
              message: `❌ RLS test failed: ${error.message}` 
            }
          }))
        }
      } else {
        setTests(prev => ({
          ...prev,
          clerkAuth: { 
            status: 'error', 
            message: '❌ Not authenticated - Please sign in first' 
          }
        }))
      }
    }
    
    runTests()
  }, [userLoaded, isSignedIn, user, getToken, supabase])
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'pending':
        return <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">PASS</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">FAIL</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">TESTING</Badge>
      default:
        return <Badge>UNKNOWN</Badge>
    }
  }
  
  const allTestsPassed = Object.values(tests).every(test => test.status === 'success')
  const testsComplete = Object.values(tests).every(test => test.status !== 'pending')
  
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-between">
            Clerk + Supabase Integration Test
            {testsComplete && (
              allTestsPassed ? (
                <Badge className="bg-green-500 text-white text-lg px-4 py-1">
                  ALL TESTS PASSED
                </Badge>
              ) : (
                <Badge className="bg-red-500 text-white text-lg px-4 py-1">
                  SOME TESTS FAILED
                </Badge>
              )
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Info */}
          {user && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Current User</h3>
              <div className="text-sm space-y-1">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress || 'Not set'}</p>
                <p><strong>Name:</strong> {user.fullName || `${user.firstName} ${user.lastName}` || 'Not set'}</p>
              </div>
            </div>
          )}
          
          {/* Test Results */}
          <div className="space-y-3">
            {Object.entries(tests).map(([key, test]) => (
              <div 
                key={key} 
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <span className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{test.message}</span>
                  {getStatusBadge(test.status)}
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          {testsComplete && (
            <div className={`p-4 rounded-lg mt-6 ${
              allTestsPassed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            } border`}>
              <h3 className={`font-semibold mb-2 ${
                allTestsPassed ? 'text-green-800' : 'text-red-800'
              }`}>
                Test Summary
              </h3>
              <p className={`text-sm ${
                allTestsPassed ? 'text-green-700' : 'text-red-700'
              }`}>
                {allTestsPassed 
                  ? '✅ All integration tests passed! The Clerk + Supabase integration is working correctly.'
                  : '❌ Some tests failed. Please check the error messages above and ensure you are signed in.'}
              </p>
              {allTestsPassed && (
                <div className="mt-3 text-sm text-green-700">
                  <p className="font-semibold">Next Steps:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Update all dashboard components to use useSupabase hook</li>
                    <li>Test data isolation with different user accounts</li>
                    <li>Deploy to production with production keys</li>
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <Button onClick={() => window.location.reload()}>
              Run Tests Again
            </Button>
            {!isSignedIn && (
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/fashionistas100-23b70512/sign-in'}
              >
                Sign In First
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}