import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react";
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import clerkConfig from './config/clerk.config'

// Initialize Sentry for error monitoring
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
    // Session Replay
    replaysSessionSampleRate: 0.1, // Sample 10% of sessions
    replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
  });
}

// Import your Publishable Key with proper validation
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error(
    'Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env.local file'
  )
}

// Validate environment
const isDevelopment = import.meta.env.MODE === 'development'
const isProduction = import.meta.env.MODE === 'production'

// Log environment info in development
if (isDevelopment) {
  console.log('🎭 Clerk Authentication Initialized', {
    environment: import.meta.env.MODE,
    publicKey: PUBLISHABLE_KEY.substring(0, 20) + '...',
    redirects: clerkConfig.redirects,
  })
  console.log('🔍 Sentry Error Monitoring', {
    enabled: !!import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE
  })
}

// Wrap App with Sentry Error Boundary
const AppWithErrorBoundary = Sentry.withErrorBoundary(App, {
  fallback: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Oops! Something went wrong</h2>
          <p className="mt-2 text-gray-600">We've been notified and are working on a fix.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  ),
  showDialog: import.meta.env.MODE === 'development'
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={clerkConfig.appearance}
      localization="en-US"
      afterSignInUrl={clerkConfig.redirects.afterSignInUrl}
      afterSignUpUrl={clerkConfig.redirects.afterSignUpUrl}
      afterSignOutUrl={clerkConfig.redirects.afterSignOutUrl}
      signInUrl={clerkConfig.redirects.signInUrl}
      signUpUrl={clerkConfig.redirects.signUpUrl}
    >
      <AppWithErrorBoundary />
    </ClerkProvider>
  </StrictMode>,
)