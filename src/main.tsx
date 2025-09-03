import React from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/onboarding"
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: 'hsl(0 0% 0%)',
          colorBackground: 'hsl(0 0% 100%)',
          borderRadius: '0.5rem',
          fontFamily: 'inherit'
        }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
