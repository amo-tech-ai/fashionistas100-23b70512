# 📁 File Placement Index - FashionOS Project

This index provides a comprehensive guide for where all files should be placed in the FashionOS project structure.

---

## 🏗️ **Project Directory Structure**

```
fashionos-project/
├── 📁 src/                          # Source code
├── 📁 public/                       # Static assets
├── 📁 docs/                         # Documentation
├── 📁 scripts/                      # Development scripts
├── 📁 supabase/                     # Supabase configuration
├── 📁 plan/                         # Project planning
├── 📁 tests/                        # Test files
├── 📁 api/                          # API routes
├── 📁 components/                   # React components
├── 📁 styles/                       # CSS and styling
├── 📁 utils/                        # Utility functions
├── 📁 types/                        # TypeScript types
├── 📁 hooks/                        # React hooks
├── 📁 services/                     # Business logic
├── 📁 constants/                    # Application constants
├── 📁 config/                       # Configuration files
├── 📁 assets/                       # Images, icons, etc.
└── 📁 deployment/                   # Deployment files
```

---

## 📋 **File Placement Guide by Category**

### 🔧 **Source Code Files**

| File Type | Location | Examples |
|-----------|----------|----------|
| **React Components** | `src/components/` | `Button.tsx`, `Header.tsx`, `Dashboard.tsx` |
| **Pages/Views** | `src/pages/` | `Home.tsx`, `Dashboard.tsx`, `Login.tsx` |
| **Hooks** | `src/hooks/` | `useAuth.ts`, `useSupabase.ts`, `useDashboard.ts` |
| **Services** | `src/services/` | `authService.ts`, `supabaseService.ts`, `apiService.ts` |
| **Utils** | `src/utils/` | `helpers.ts`, `formatters.ts`, `validators.ts` |
| **Types** | `src/types/` | `auth.ts`, `dashboard.ts`, `supabase.ts` |
| **Constants** | `src/constants/` | `routes.ts`, `api.ts`, `config.ts` |
| **Styles** | `src/styles/` | `globals.css`, `components.css`, `themes.css` |

### 📚 **Documentation Files**

| File Type | Location | Examples |
|-----------|----------|----------|
| **Project Docs** | `docs/` | `README.md`, `DEPLOYMENT.md`, `API.md` |
| **Supabase Docs** | `docs/supabase/` | `connection.md`, `schema.md`, `queries.md` |
| **Clerk Docs** | `docs/clerk/` | `auth-setup.md`, `integration.md` |
| **Deployment Docs** | `docs/deployment/` | `vercel.md`, `production.md` |
| **Testing Docs** | `docs/testing/` | `test-plan.md`, `coverage.md` |
| **Design Docs** | `docs/design/` | `ui-guide.md`, `components.md` |

### 🔨 **Scripts and Tools**

| File Type | Location | Examples |
|-----------|----------|----------|
| **Supabase Scripts** | `scripts/supabase/` | `01-analyze-supabase.mjs`, `02-audit.mjs` |
| **Clerk Scripts** | `scripts/clerk/` | `01-auth-fix.js`, `02-diagnostic.mjs` |
| **Testing Scripts** | `scripts/testing/` | `01-test-dashboard.js`, `02-validate.mjs` |
| **Utility Scripts** | `scripts/utilities/` | `01-viewer.html`, `02-generator.js` |
| **Build Scripts** | `scripts/build/` | `build.js`, `deploy.sh` |
| **Database Scripts** | `scripts/database/` | `migrate.sql`, `seed.js` |

### 🗄️ **Database Files**

| File Type | Location | Examples |
|-----------|----------|----------|
| **Migrations** | `supabase/migrations/` | `001_initial.sql`, `002_users.sql` |
| **Functions** | `supabase/functions/` | `auth.ts`, `webhooks.ts` |
| **Seeds** | `supabase/seeds/` | `users.sql`, `events.sql` |
| **Config** | `supabase/` | `config.toml`, `schema.sql` |
| **Types** | `supabase/types/` | `database.ts`, `generated.ts` |

### 🧪 **Testing Files**

| File Type | Location | Examples |
|-----------|----------|----------|
| **Unit Tests** | `tests/unit/` | `Button.test.tsx`, `utils.test.ts` |
| **Integration Tests** | `tests/integration/` | `auth.test.ts`, `api.test.ts` |
| **E2E Tests** | `tests/e2e/` | `dashboard.spec.ts`, `auth.spec.ts` |
| **Test Utils** | `tests/utils/` | `test-helpers.ts`, `mock-data.ts` |
| **Fixtures** | `tests/fixtures/` | `users.json`, `events.json` |

### 🎨 **Assets and Static Files**

| File Type | Location | Examples |
|-----------|----------|----------|
| **Images** | `public/images/` | `logo.png`, `hero.jpg`, `icons/` |
| **Icons** | `public/icons/` | `favicon.ico`, `apple-touch-icon.png` |
| **Fonts** | `public/fonts/` | `Inter.woff2`, `Roboto.ttf` |
| **Documents** | `public/docs/` | `terms.pdf`, `privacy.pdf` |
| **Manifests** | `public/` | `manifest.json`, `robots.txt` |

### ⚙️ **Configuration Files**

| File Type | Location | Examples |
|-----------|----------|----------|
| **Package Config** | Root | `package.json`, `package-lock.json` |
| **Build Config** | Root | `vite.config.ts`, `tsconfig.json` |
| **Linting Config** | Root | `eslint.config.js`, `.prettierrc` |
| **Environment** | Root | `.env.example`, `.env.local` |
| **Deployment** | Root | `vercel.json`, `netlify.toml` |

### 📋 **Planning and Documentation**

| File Type | Location | Examples |
|-----------|----------|----------|
| **Project Plans** | `plan/` | `001-overview.md`, `002-features.md` |
| **Dashboard Plans** | `plan/dashboard/` | `layout.md`, `components.md` |
| **API Plans** | `plan/api/` | `endpoints.md`, `auth.md` |
| **Database Plans** | `plan/database/` | `schema.md`, `migrations.md` |

---

## 🎯 **Specific File Placement Rules**

### ✅ **DO Place Files Here**

#### **React Components**
```
src/components/
├── ui/                    # Basic UI components (Button, Input, etc.)
├── forms/                 # Form components
├── layout/                # Layout components (Header, Sidebar, etc.)
├── dashboard/             # Dashboard-specific components
├── auth/                  # Authentication components
└── common/                # Shared/common components
```

#### **Pages and Routes**
```
src/pages/
├── auth/                  # Authentication pages
├── dashboard/             # Dashboard pages
├── events/                # Event-related pages
├── profile/               # User profile pages
└── admin/                 # Admin pages
```

#### **Business Logic**
```
src/services/
├── auth/                  # Authentication services
├── supabase/              # Supabase services
├── api/                   # API services
├── storage/               # File storage services
└── notifications/         # Notification services
```

### ❌ **DON'T Place Files Here**

#### **Avoid Root Directory Clutter**
- ❌ Don't put scripts in root (use `scripts/`)
- ❌ Don't put docs in root (use `docs/`)
- ❌ Don't put test files in root (use `tests/`)
- ❌ Don't put config files scattered (group them)

#### **Avoid Mixed File Types**
- ❌ Don't mix `.js` and `.ts` files in same directory
- ❌ Don't put components with business logic
- ❌ Don't put utilities with components

---

## 📊 **File Naming Conventions**

### 🔤 **Naming Standards**

| File Type | Convention | Example |
|-----------|------------|---------|
| **Components** | PascalCase | `UserDashboard.tsx` |
| **Pages** | PascalCase | `LoginPage.tsx` |
| **Hooks** | camelCase with `use` | `useAuth.ts` |
| **Services** | camelCase | `authService.ts` |
| **Utils** | camelCase | `formatDate.ts` |
| **Types** | PascalCase | `UserType.ts` |
| **Constants** | UPPER_SNAKE_CASE | `API_ENDPOINTS.ts` |
| **Scripts** | kebab-case with numbers | `01-setup-database.js` |

### 📁 **Directory Naming**

| Type | Convention | Example |
|------|------------|---------|
| **Components** | kebab-case | `user-dashboard/` |
| **Pages** | kebab-case | `auth-pages/` |
| **Services** | kebab-case | `auth-service/` |
| **Scripts** | kebab-case | `supabase-scripts/` |

---

## 🚀 **Quick File Placement Checklist**

### ✅ **Before Adding a New File, Ask:**

1. **What type of file is it?**
   - Component → `src/components/`
   - Page → `src/pages/`
   - Service → `src/services/`
   - Script → `scripts/`
   - Documentation → `docs/`

2. **What's its purpose?**
   - Database related → `supabase/` or `scripts/supabase/`
   - Authentication → `scripts/clerk/` or `src/services/auth/`
   - Testing → `tests/` or `scripts/testing/`
   - Utility → `scripts/utilities/` or `src/utils/`

3. **Is it numbered correctly?**
   - Scripts should be numbered: `01-`, `02-`, `03-`
   - Components should follow naming conventions
   - Documentation should be in proper category

4. **Does it follow naming conventions?**
   - PascalCase for components and types
   - camelCase for functions and services
   - kebab-case for directories and scripts

---

## 📋 **Common File Patterns**

### 🔄 **Component Structure**
```
src/components/UserDashboard/
├── UserDashboard.tsx      # Main component
├── UserDashboard.test.tsx # Tests
├── UserDashboard.module.css # Styles
├── index.ts               # Export
└── types.ts               # Component types
```

### 🔄 **Service Structure**
```
src/services/auth/
├── authService.ts         # Main service
├── authService.test.ts    # Tests
├── types.ts               # Service types
└── constants.ts           # Service constants
```

### 🔄 **Script Structure**
```
scripts/supabase/
├── 01-analyze.mjs         # Analysis script
├── 02-audit.mjs           # Audit script
├── 03-fix.sql             # SQL fixes
└── README.md              # Script documentation
```

---

## 🎯 **Migration Guide**

### **If You Have Misplaced Files:**

1. **Identify the file type and purpose**
2. **Check this index for correct location**
3. **Move to proper directory**
4. **Update any import statements**
5. **Update documentation if needed**

### **Example Migration:**
```bash
# Wrong location
./auth-fix.js

# Correct location
./scripts/clerk/01-auth-fix.js

# Update imports
import { authFix } from '../scripts/clerk/01-auth-fix.js'
```

---

## 📚 **Additional Resources**

- **Scripts Documentation**: `scripts/README.md`
- **Project Organization**: `PROJECT_ORGANIZATION_COMPLETE.md`
- **Component Guidelines**: `docs/design/components.md`
- **API Documentation**: `docs/api/endpoints.md`

---

**Last Updated**: October 1, 2025  
**Total Categories**: 8 main categories  
**File Types Covered**: 50+ file types  
**Status**: ✅ **COMPREHENSIVE INDEX COMPLETE**
