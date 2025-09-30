/**
 * Environment-aware Clerk key selection
 * Production domain (fashionistas.one) uses live keys
 * All other domains (staging, preview) use test keys
 */
export function getClerkPublishableKey(): string {
  const hostname = window.location.hostname;
  const isProductionDomain = hostname === 'fashionistas.one' || hostname.endsWith('.fashionistas.one');
  
  // Use live key only on actual production domain
  const liveKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const testKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY_TEST;
  
  const selectedKey = isProductionDomain ? liveKey : (testKey || liveKey);
  
  if (!selectedKey) {
    console.error('❌ Missing Clerk publishable key', {
      hostname,
      isProductionDomain,
      hasLiveKey: !!liveKey,
      hasTestKey: !!testKey
    });
    throw new Error('Missing Clerk publishable key');
  }
  
  // Log in development only
  if (import.meta.env.MODE === 'development') {
    console.log('🔑 Clerk key selected:', {
      hostname,
      isProductionDomain,
      keyType: isProductionDomain ? 'live' : 'test',
      keyPrefix: selectedKey.substring(0, 12) + '...'
    });
  }
  
  return selectedKey;
}
