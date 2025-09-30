# 🚨 EMERGENCY SECURITY FIXES - IMMEDIATE ACTION REQUIRED

## ⚠️ **CRITICAL SECURITY ALERT**
**All live secrets have been committed to the repository. This is a PRODUCTION SECURITY INCIDENT requiring immediate action.**

---

## 🔥 **IMMEDIATE ACTIONS (DO NOW)**

### **1. ROTATE ALL SECRETS (PRIORITY 1)**

#### **Clerk Keys**
- Go to Clerk Dashboard → API Keys
- Generate new publishable key
- Generate new secret key
- Update JWT template if needed

#### **Supabase Keys**
- Go to Supabase Dashboard → Settings → API
- Generate new anon key
- Generate new service role key

#### **Stripe Keys**
- Go to Stripe Dashboard → Developers → API Keys
- Generate new publishable key
- Generate new secret key

#### **Other Services**
- OpenAI API key
- GitHub tokens
- Qdrant credentials
- Any other API keys

### **2. CLEAN REPOSITORY (PRIORITY 1)**

```bash
# Create secure .env.local (NOT tracked by git)
cat > .env.local << 'EOF'
# FashionOS Environment Variables - DO NOT COMMIT TO GIT
VITE_CLERK_PUBLISHABLE_KEY=pk_test_NEW_ROTATED_KEY_HERE
CLERK_SECRET_KEY=sk_test_NEW_ROTATED_SECRET_HERE
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=NEW_ROTATED_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=NEW_ROTATED_SERVICE_KEY_HERE
EOF

# Remove .env from tracking
git rm --cached .env
git rm --cached .env.local

# Add to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
echo "*.key" >> .gitignore
echo "secrets/" >> .gitignore

# Commit the cleanup
git add .gitignore
git commit -m "SECURITY: Remove secrets from tracking, add to gitignore"
```

### **3. FIX CLERK INTEGRATION (PRIORITY 2)**

#### **Update src/main.tsx**
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </StrictMode>
);
```

#### **Update src/App.tsx**
Remove ClerkProvider from App.tsx - it should only be in main.tsx

#### **Update src/lib/supabase-clerk.ts**
```tsx
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';
import { useMemo } from 'react';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export function useSupabase() {
  const { getToken } = useAuth();
  
  const client = useMemo(
    () => createClient<Database>(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: async (url, options: RequestInit = {}) => {
          const token = await getToken({ template: 'supabase' });
          const headers = new Headers(options?.headers);
          
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          
          return fetch(url, { ...options, headers });
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }),
    [getToken]
  );
  
  return client;
}
```

### **4. UPDATE SUPABASE CONFIG**

#### **Add to supabase/config.toml**
```toml
[auth.third_party.clerk]
enabled = true
domain = "charming-serval-15.clerk.accounts.dev"
```

### **5. CONFIGURE CLERK JWT TEMPLATE**

In Clerk Dashboard:
1. Go to JWT Templates
2. Create new template named "supabase"
3. Add these claims:
```json
{
  "aud": "authenticated",
  "role": "authenticated",
  "user_id": "{{user.id}}",
  "org_id": "{{organization.id}}",
  "org_role": "{{organization.membership.role}}"
}
```

---

## 🛡️ **SECURITY CHECKLIST**

### **Immediate (Today)**
- [ ] 🔴 Rotate ALL API keys and secrets
- [ ] 🔴 Remove .env files from git tracking
- [ ] 🔴 Create secure .env.local with new keys
- [ ] 🔴 Update .gitignore to block secrets
- [ ] 🔴 Commit security fixes

### **Within 24 Hours**
- [ ] 🔴 Fix ClerkProvider location
- [ ] 🔴 Update Supabase client with token injection
- [ ] 🔴 Configure Clerk JWT template
- [ ] 🔴 Update Supabase config
- [ ] 🔴 Test authentication flow

### **Within 48 Hours**
- [ ] 🟡 Deploy fixed RLS migration
- [ ] 🟡 Implement detective tests
- [ ] 🟡 Set up secret scanning in CI/CD
- [ ] 🟡 Document security procedures

---

## 🚨 **DO NOT DEPLOY UNTIL**

1. ✅ All secrets are rotated
2. ✅ Repository is cleaned of secrets
3. ✅ ClerkProvider is in main.tsx
4. ✅ Token injection is working
5. ✅ JWT template is configured
6. ✅ Detective tests are passing

---

## 📞 **EMERGENCY CONTACTS**

If you need immediate assistance:
- Review the detective audit report
- Check the comprehensive action plan
- Follow the security checklist above

**Remember**: Security is the highest priority. Do not rush deployment until all security issues are resolved.
