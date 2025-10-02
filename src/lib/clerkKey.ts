/**
 * Environment-aware Clerk key selection
 * Production domain (fashionistas.one) uses live keys
 * All other domains (staging, preview) use test keys
 */
export function getClerkPublishableKey(): string {
  const hostname = window.location.hostname;
  const isProductionDomain = hostname === 'fashionistas.one' || hostname.endsWith('.fashionistas.one');

  // Prefer environment-provided keys
  const liveKey = (import.meta as any)?.env?.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
  const testKey = (import.meta as any)?.env?.VITE_CLERK_PUBLISHABLE_KEY_TEST as string | undefined;

  // Allow runtime injection via global if build-time envs are missing
  const runtimeKey = (window as any).__CLERK_PUBLISHABLE_KEY as string | undefined;

  // Public publishable fallback (safe to ship; prevents hard crash in staging)
  const FALLBACK_TEST_KEY = 'pk_test_Y2hhcm1pbmctc2VydmFsLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';

  // Resolve preferred key following domain rules, then runtime, then fallback
  const preferredByDomain = isProductionDomain ? liveKey : (testKey || liveKey);
  const resolvedKey = preferredByDomain || runtimeKey || FALLBACK_TEST_KEY;

  // Safe logging (development only)
  if ((import.meta as any)?.env?.DEV) {
    console.log('🔑 Clerk Key Selection:', {
      hostname,
      isProductionDomain,
      hasLiveKey: !!liveKey,
      hasTestKey: !!testKey,
      usedRuntimeKey: !preferredByDomain && !!runtimeKey,
      usedFallback: !preferredByDomain && !runtimeKey,
      keyType: isProductionDomain ? 'LIVE' : (!!testKey ? 'TEST' : (liveKey ? 'LIVE-FALLBACK' : (runtimeKey ? 'RUNTIME' : 'PUBLIC-FALLBACK'))),
      keyPrefix: resolvedKey?.substring(0, 15) + '...'
    });
  }

  if (!preferredByDomain) {
    console.warn('⚠️ Clerk publishable key not found in build-time envs. Using runtime or public fallback. Configure VITE_CLERK_PUBLISHABLE_KEY to avoid this.');
  }

  return resolvedKey;
}
