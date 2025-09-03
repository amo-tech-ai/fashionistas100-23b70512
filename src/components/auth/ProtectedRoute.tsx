import { useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth()
  
  if (!isLoaded) {
    return <LoadingSkeleton />
  }
  
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }
  
  return <>{children}</>
}