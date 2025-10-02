import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react";
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { queryClient } from './lib/queryClient'
import { getClerkPublishableKey } from './lib/clerkKey'
import { AppWithErrorBoundary } from './components/AppWithErrorBoundary'
import { registerServiceWorker } from './utils/registerServiceWorker'

// Get the appropriate Clerk key based on environment
const PUBLISHABLE_KEY = getClerkPublishableKey();

console.log('🚀 Main.tsx initializing with Clerk key:', PUBLISHABLE_KEY?.substring(0, 20) + '...');

// Initialize Sentry for error monitoring (early and quiet in dev)
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || undefined,
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: import.meta.env.MODE === 'production' ? 0.2 : 0.0,
  // Session Replay
  replaysSessionSampleRate: 0.0, // Keep off unless needed
  replaysOnErrorSampleRate: 1.0, // Capture replay only when errors happen
});

// Validate environment
const isDevelopment = import.meta.env.MODE === 'development'
const isProduction = import.meta.env.MODE === 'production'

// Log environment info in development
if (isDevelopment) {
  console.log('🔍 Sentry Error Monitoring', {
    enabled: !!import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE
  })
}

// Prevent double-mount in dev mode or preview environments
const container = document.getElementById('root')!;
if (!(container as any).__reactRoot) {
  (container as any).__reactRoot = true;
  
  createRoot(container).render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppWithErrorBoundary />
          </BrowserRouter>
        </QueryClientProvider>
      </ClerkProvider>
    </StrictMode>,
  );
  
  // Register service worker for PWA functionality (production only)
  if (isProduction) {
    registerServiceWorker();
  }
} else {
  console.warn('React root already mounted, skipping duplicate mount');
}