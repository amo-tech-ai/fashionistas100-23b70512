import { Navigate } from 'react-router-dom'

export default function SignUpPage() {
  // Redirect to auth page since we're using Supabase  
  return <Navigate to="/auth" replace />;
}