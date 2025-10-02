# 🎯 Quick File Placement Reference Card

## 📁 **Where to Put Files - Quick Reference**

### 🔧 **Source Code**
```
src/components/     → React components (Button.tsx, Dashboard.tsx)
src/pages/         → Page components (Home.tsx, Login.tsx)
src/hooks/         → Custom hooks (useAuth.ts, useSupabase.ts)
src/services/      → Business logic (authService.ts, apiService.ts)
src/utils/         → Helper functions (helpers.ts, formatters.ts)
src/types/         → TypeScript types (auth.ts, dashboard.ts)
src/constants/     → Constants (routes.ts, api.ts)
src/styles/        → CSS files (globals.css, components.css)
```

### 🗄️ **Database & Supabase**
```
supabase/migrations/     → SQL migrations (001_initial.sql)
supabase/functions/      → Edge functions (auth.ts, webhooks.ts)
supabase/seeds/          → Seed data (users.sql, events.sql)
scripts/supabase/        → Database scripts (01-analyze.mjs)
```

### 🔐 **Authentication & Clerk**
```
scripts/clerk/           → Clerk scripts (01-auth-fix.js)
docs/clerk/              → Clerk documentation (auth-setup.md)
src/services/auth/       → Auth services (authService.ts)
```

### 🧪 **Testing**
```
tests/unit/              → Unit tests (Button.test.tsx)
tests/integration/       → Integration tests (auth.test.ts)
tests/e2e/               → E2E tests (dashboard.spec.ts)
scripts/testing/         → Test scripts (01-test-dashboard.js)
```

### 📚 **Documentation**
```
docs/                    → Main documentation (README.md, API.md)
docs/supabase/           → Supabase docs (connection.md, schema.md)
docs/clerk/              → Clerk docs (auth-setup.md)
docs/deployment/         → Deployment guides (vercel.md)
docs/design/             → Design docs (ui-guide.md, components.md)
```

### 🛠️ **Scripts & Tools**
```
scripts/supabase/        → Database scripts (01-analyze-supabase.mjs)
scripts/clerk/           → Auth scripts (01-apply-clerk-fix.js)
scripts/testing/         → Test scripts (01-test-dashboard.js)
scripts/utilities/       → Utility tools (01-viewer.html)
scripts/build/           → Build scripts (build.js, deploy.sh)
```

### 🎨 **Assets & Static**
```
public/images/           → Images (logo.png, hero.jpg)
public/icons/            → Icons (favicon.ico, apple-touch-icon.png)
public/fonts/            → Fonts (Inter.woff2, Roboto.ttf)
src/assets/              → Component assets (images, icons)
```

### ⚙️ **Configuration**
```
Root directory           → Config files (package.json, vite.config.ts)
.env files              → Environment variables (.env.local)
```

### 📋 **Planning**
```
plan/                    → Project plans (001-overview.md)
plan/dashboard/          → Dashboard plans (layout.md)
plan/api/                → API plans (endpoints.md)
plan/database/           → Database plans (schema.md)
```

---

## 🔤 **Naming Conventions**

### **Files**
- **Components**: `PascalCase` → `UserDashboard.tsx`
- **Pages**: `PascalCase` → `LoginPage.tsx`
- **Hooks**: `camelCase` with `use` → `useAuth.ts`
- **Services**: `camelCase` → `authService.ts`
- **Utils**: `camelCase` → `formatDate.ts`
- **Scripts**: `kebab-case` with numbers → `01-setup-database.js`

### **Directories**
- **All directories**: `kebab-case` → `user-dashboard/`, `auth-pages/`

---

## 🚀 **Quick Decision Tree**

```
Is it a React component? → src/components/
Is it a page/view? → src/pages/
Is it a hook? → src/hooks/
Is it business logic? → src/services/
Is it a utility function? → src/utils/
Is it a type definition? → src/types/
Is it a constant? → src/constants/
Is it CSS/styling? → src/styles/

Is it a database script? → scripts/supabase/
Is it an auth script? → scripts/clerk/
Is it a test script? → scripts/testing/
Is it a utility tool? → scripts/utilities/

Is it documentation? → docs/
Is it a migration? → supabase/migrations/
Is it a test? → tests/
Is it an asset? → public/ or src/assets/
```

---

## ✅ **Most Common Placements**

| File Type | Location | Example |
|-----------|----------|---------|
| **React Component** | `src/components/` | `Button.tsx` |
| **Page** | `src/pages/` | `Dashboard.tsx` |
| **Custom Hook** | `src/hooks/` | `useAuth.ts` |
| **Service** | `src/services/` | `authService.ts` |
| **Utility** | `src/utils/` | `helpers.ts` |
| **Type** | `src/types/` | `User.ts` |
| **Database Script** | `scripts/supabase/` | `01-analyze.mjs` |
| **Auth Script** | `scripts/clerk/` | `01-fix-auth.js` |
| **Test** | `tests/` | `Button.test.tsx` |
| **Documentation** | `docs/` | `README.md` |
| **Image** | `public/images/` | `logo.png` |

---

## 🚨 **Common Mistakes to Avoid**

❌ **Don't put**:
- Scripts in root → Use `scripts/`
- Docs in root → Use `docs/`
- Tests in root → Use `tests/`
- Mixed file types in same folder
- Components with business logic

✅ **Do**:
- Group by technology/purpose
- Use consistent naming
- Number scripts sequentially
- Separate concerns properly

---

**Quick Reference for FashionOS Project**  
**Last Updated**: October 1, 2025
