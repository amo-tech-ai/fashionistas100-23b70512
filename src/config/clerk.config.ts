// Clerk Configuration - Best Practices Setup
import { dark } from '@clerk/themes';

// Clerk appearance configuration following best practices
export const clerkAppearance = {
  // Use built-in theme as base
  baseTheme: undefined, // Use dark theme for dark mode: dark
  
  // Custom styling matching your brand
  layout: {
    socialButtonsPlacement: 'top',
    socialButtonsVariant: 'blockButton',
    termsPageUrl: '/terms',
    privacyPageUrl: '/privacy',
    helpPageUrl: '/help',
    logoPlacement: 'inside',
    shimmer: true,
  },
  
  variables: {
    // Colors - Fashion industry purple/pink gradient
    colorPrimary: '#9333EA', // Purple
    colorDanger: '#EF4444',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorNeutral: '#6B7280',
    
    // Typography
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    fontFamilyButtons: '"Inter", system-ui, -apple-system, sans-serif',
    fontSize: '1rem',
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 600,
    },
    
    // Spacing
    spacingUnit: '1rem',
    borderRadius: '0.5rem',
  },
  
  elements: {
    // Root container
    rootBox: 'w-full',
    card: 'shadow-xl border-0 bg-white dark:bg-gray-900',
    
    // Headers
    headerTitle: 'text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent',
    headerSubtitle: 'text-gray-600 dark:text-gray-400 mt-2',
    
    // Form elements
    formButtonPrimary: 
      'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]',
    
    formButtonSecondary: 
      'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
    
    formFieldInput: 
      'border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 rounded-lg',
    
    formFieldLabel: 
      'text-gray-700 dark:text-gray-300 font-medium text-sm',
    
    formFieldError: 
      'text-red-500 text-sm mt-1',
    
    // Social buttons
    socialButtonsBlockButton: 
      'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200',
    
    socialButtonsBlockButtonText: 
      'text-gray-700 dark:text-gray-300 font-medium',
    
    // Links
    footerActionLink: 
      'text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium underline-offset-2',
    
    // Dividers
    dividerLine: 
      'bg-gray-200 dark:bg-gray-700',
    
    dividerText: 
      'text-gray-500 dark:text-gray-400 text-sm',
    
    // Alerts and badges
    alert: 
      'rounded-lg p-4',
    
    alertSuccess: 
      'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    
    alertError: 
      'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    
    badge: 
      'px-2 py-1 text-xs font-medium rounded-full',
    
    // User button
    userButtonBox: 
      'rounded-full ring-2 ring-purple-500 ring-offset-2',
    
    userButtonTrigger: 
      'focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
    
    // Avatars
    avatarBox: 
      'rounded-full border-2 border-purple-500',
    
    avatarImage: 
      'rounded-full',
    
    // Modal overlays
    modalBackdrop: 
      'bg-black/50 backdrop-blur-sm',
    
    modalContent: 
      'bg-white dark:bg-gray-900 rounded-xl shadow-2xl',
    
    // Loading states
    spinner: 
      'text-purple-600',
    
    // OTP input
    otpCodeFieldInput: 
      'text-center font-mono text-2xl border-gray-300 focus:border-purple-500',
  },
};

// Clerk localization (optional)
export const clerkLocalization = {
  socialButtonsBlockButton: {
    text: 'Continue with {{provider}}',
  },
  signIn: {
    title: 'Welcome back',
    subtitle: 'Sign in to your Fashionistas account',
  },
  signUp: {
    title: 'Create your account',
    subtitle: 'Join the fashion community',
  },
  userButton: {
    action__manageAccount: 'Manage account',
    action__signOut: 'Sign out',
  },
  userProfile: {
    navbar: {
      title: 'Account settings',
      account: 'Profile',
      security: 'Security',
    },
  },
  formFieldError__required: 'This field is required',
  formFieldError__email: 'Please enter a valid email address',
  formFieldError__password: 'Password must be at least 8 characters',
};

// Security configuration
export const clerkSecurityConfig = {
  // Password requirements
  passwordSettings: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChar: true,
  },
  
  // Session settings
  sessionSettings: {
    // Expire session after 7 days of inactivity
    inactivityTimeout: 7 * 24 * 60 * 60 * 1000,
    // Absolute session timeout after 30 days
    absoluteTimeout: 30 * 24 * 60 * 60 * 1000,
  },
  
  // Multi-factor authentication
  mfaSettings: {
    // Allow users to enable MFA
    allowMfa: true,
    // Require MFA for admin users
    requireMfaForRoles: ['admin', 'organizer'],
  },
  
  // Rate limiting
  rateLimiting: {
    signInAttempts: 5,
    signUpAttempts: 3,
    passwordResetAttempts: 3,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
};

// OAuth providers configuration
export const clerkOAuthProviders = {
  google: {
    enabled: true,
    scopes: ['openid', 'email', 'profile'],
  },
  facebook: {
    enabled: true,
    scopes: ['email', 'public_profile'],
  },
  github: {
    enabled: false,
    scopes: ['read:user', 'user:email'],
  },
  linkedin: {
    enabled: false,
    scopes: ['r_liteprofile', 'r_emailaddress'],
  },
};

// Redirect URLs
export const clerkRedirects = {
  signInUrl: import.meta.env.VITE_CLERK_SIGN_IN_URL || '/sign-in',
  signUpUrl: import.meta.env.VITE_CLERK_SIGN_UP_URL || '/sign-up',
  afterSignInUrl: import.meta.env.VITE_CLERK_AFTER_SIGN_IN_URL || '/dashboard',
  afterSignUpUrl: import.meta.env.VITE_CLERK_AFTER_SIGN_UP_URL || '/onboarding',
  afterSignOutUrl: '/',
};

// Webhook configuration for backend sync
export const clerkWebhookConfig = {
  endpoint: '/api/clerk/webhook',
  events: [
    'user.created',
    'user.updated',
    'user.deleted',
    'session.created',
    'session.ended',
    'organization.created',
    'organization.updated',
    'organizationMembership.created',
    'organizationMembership.deleted',
  ],
};

// Export all configurations
export default {
  appearance: clerkAppearance,
  localization: clerkLocalization,
  security: clerkSecurityConfig,
  oauth: clerkOAuthProviders,
  redirects: clerkRedirects,
  webhook: clerkWebhookConfig,
};