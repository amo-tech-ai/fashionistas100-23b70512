/**
 * Environment-aware Clerk key selection
 * Production domain (fashionistas.one) uses live keys
 * All other domains (staging, preview) use test keys
 */
export function getClerkPublishableKey(): string {
  const hostname = window.location.hostname;
  const isProductionDomain = hostname === 'fashionistas.one' || hostname.endsWith('.fashionistas.one');
  
  // Get both keys
  const liveKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const testKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY_TEST;
  
  // For staging domains, prefer test key
  // For production domain, use live key
  const selectedKey = isProductionDomain ? liveKey : (testKey || liveKey);
  
  // Always log key selection for debugging
  console.log('🔑 Clerk Key Selection:', {
    hostname,
    isProductionDomain,
    hasLiveKey: !!liveKey,
    hasTestKey: !!testKey,
    usingTestKey: !isProductionDomain && !!testKey,
    keyType: isProductionDomain ? 'LIVE' : (testKey ? 'TEST' : 'LIVE-FALLBACK'),
    keyPrefix: selectedKey?.substring(0, 15) + '...',
    fullKey: selectedKey // TEMPORARY - for debugging only
  });
  
  if (!selectedKey) {
    console.error('❌ Missing Clerk publishable key', {
      hostname,
      isProductionDomain,
      hasLiveKey: !!liveKey,
      hasTestKey: !!testKey,
      envKeys: Object.keys(import.meta.env).filter(k => k.includes('CLERK'))
    });
    throw new Error('Missing Clerk publishable key - check .env file');
  }
  
  return selectedKey;
}
