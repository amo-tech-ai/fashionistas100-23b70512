# 🔐 Roles & Permissions Reference

## Role Definitions

### Database Enum (`user_role`)
```sql
CREATE TYPE user_role AS ENUM (
  'admin',
  'organizer',
  'designer',
  'venue_owner',
  'sponsor',
  'attendee'
);
```

### Application Roles (`src/lib/roles.ts`)
```typescript
export const ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  DESIGNER: 'designer',
  VENUE_OWNER: 'venue_owner',
  SPONSOR: 'sponsor',
  ATTENDEE: 'attendee',
} as const;
```

---

## Role Capabilities

### 👑 Admin
**Dashboard:** `/dashboard/admin/overview`

**Can Access:**
- All other dashboards (organizer, designer, venue, sponsor, user)
- User management
- System configuration
- Analytics across all organizations
- Audit logs

**Cannot Access:**
- N/A (admin has full access)

**Use Cases:**
- Platform operators
- Super users
- Support staff

---

### 🎭 Organizer
**Dashboard:** `/dashboard/organizer/overview`

**Can Access:**
- Create and manage events
- View event analytics
- Manage ticket sales
- Book venues
- Hire designers/models
- View attendee list

**Cannot Access:**
- Other organizers' events
- Admin settings
- Global analytics

**Use Cases:**
- Fashion show producers
- Event coordinators
- Brand event managers

---

### 👗 Designer
**Dashboard:** `/dashboard/designer/overview`

**Can Access:**
- Portfolio management
- Event applications
- Booking requests
- Collection showcase
- Press mentions
- Revenue analytics

**Cannot Access:**
- Creating events
- Venue bookings
- Other designers' portfolios

**Use Cases:**
- Fashion designers
- Clothing brands
- Independent creators

---

### 🏛️ Venue Owner
**Dashboard:** `/dashboard/venue/overview`

**Can Access:**
- Venue profile management
- Availability calendar
- Booking requests
- Venue analytics
- Photo gallery
- Pricing settings

**Cannot Access:**
- Creating events (only hosting)
- Other venues' data
- Designer portfolios

**Use Cases:**
- Event space owners
- Hotel ballroom managers
- Studio operators

---

### 💰 Sponsor
**Dashboard:** `/dashboard/sponsor/overview`

**Can Access:**
- Sponsorship opportunities
- Brand visibility metrics
- Event sponsorship history
- ROI analytics
- Media assets

**Cannot Access:**
- Creating events
- Designer portfolios
- Venue management

**Use Cases:**
- Corporate sponsors
- Brand marketing teams
- Product placement managers

---

### 🎟️ Attendee
**Dashboard:** `/dashboard/user/overview`

**Can Access:**
- Ticket purchases
- Booking history
- Event calendar
- Designer discovery
- Ticket QR codes
- Event reminders

**Cannot Access:**
- Creating events
- Managing venues
- Designer applications

**Use Cases:**
- Fashion enthusiasts
- General public
- Event attendees

---

## Dashboard Access Matrix

| Route                              | Admin | Organizer | Designer | Venue | Sponsor | Attendee |
|------------------------------------|-------|-----------|----------|-------|---------|----------|
| `/dashboard/admin/overview`        | ✅    | ❌        | ❌       | ❌    | ❌      | ❌       |
| `/dashboard/organizer/overview`    | ✅    | ✅        | ❌       | ❌    | ❌      | ❌       |
| `/dashboard/designer/overview`     | ✅    | ❌        | ✅       | ❌    | ❌      | ❌       |
| `/dashboard/venue/overview`        | ✅    | ❌        | ❌       | ✅    | ❌      | ❌       |
| `/dashboard/sponsor/overview`      | ✅    | ❌        | ❌       | ❌    | ✅      | ❌       |
| `/dashboard/user/overview`         | ✅    | ❌        | ❌       | ❌    | ❌      | ✅       |

---

## Permission Inheritance

### Admin Override
Admins can access **all** dashboards. This is intentional for:
- Customer support (view user issues)
- Content moderation (review designer portfolios)
- Financial audits (check organizer revenue)
- Technical debugging (inspect any user's data)

### No Multi-Role Support (Currently)
A user can only have **one** role at a time:
- If a designer also organizes events, they need to switch accounts
- Future enhancement: Add "organization roles" for multi-hat users

---

## Role Assignment Logic

### 1. Clerk Organization Role (Highest Priority)
```typescript
if (user.organizationMemberships?.[0]?.role === 'admin') {
  return 'admin';
}
```

### 2. Supabase Profile Role
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('user_id', userId)
  .single();

if (profile?.role) {
  return profile.role;
}
```

### 3. Clerk Public Metadata
```typescript
const clerkRole = user.publicMetadata?.role;
if (clerkRole) {
  return clerkRole;
}
```

### 4. Default Fallback
```typescript
return ROLES.ATTENDEE; // Safe default
```

---

## Setting User Roles

### Method 1: Clerk Dashboard (Manual)
1. Go to **Clerk Dashboard** → Users
2. Select a user
3. Edit **Public Metadata**:
   ```json
   {
     "role": "organizer"
   }
   ```
4. Save

### Method 2: Supabase Direct (Manual)
```sql
UPDATE profiles
SET role = 'designer'
WHERE user_id = 'clerk_user_id_here';
```

### Method 3: Admin API (Automated)
```typescript
// TODO: Create admin endpoint
POST /api/admin/users/:userId/role
{
  "role": "sponsor"
}
```

---

## Common Issues & Fixes

### Issue: User has no role
**Symptom:** Redirected to `/dashboard/user/overview` when they should have higher access  
**Fix:** Check Clerk metadata or Supabase `profiles.role`

### Issue: Wrong dashboard after login
**Symptom:** Organizer lands on user dashboard  
**Debug:**
```typescript
// Check in browser console
import { useResolvedRole } from '@/hooks/useResolvedRole';
const { role } = useResolvedRole();
console.log('Current role:', role);
```

### Issue: 403 Forbidden on correct dashboard
**Symptom:** User role is correct but still blocked  
**Fix:** Clear browser cache, verify `ROLE_DASHBOARD_MAP` matches route paths

---

## Security Best Practices

### Client-Side Guards (Implemented)
✅ Prevent UI navigation to unauthorized pages  
✅ Hide menu items for inaccessible features  
✅ Show friendly error messages on 403

### Server-Side Enforcement (Required)
🔴 **TODO:** Validate JWT tokens in API routes  
🔴 **TODO:** Use Supabase RLS policies for data access  
🔴 **TODO:** Audit log role changes

**Example RLS Policy:**
```sql
-- Only organizers can create events
CREATE POLICY "organizers_create_events"
ON events
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE role = 'organizer'
  )
);
```

---

## Testing Roles

### Manual Testing
1. Sign up with different emails
2. Assign different roles via Clerk
3. Login and verify dashboard access
4. Try accessing unauthorized routes (should see 403)

### Automated Testing (Future)
```typescript
// Playwright test example
test('organizer cannot access designer dashboard', async ({ page }) => {
  await loginAs('organizer');
  await page.goto('/dashboard/designer/overview');
  await expect(page).toHaveURL('/403');
});
```

---

## Migration Path

### Changing Role Structure
If you need to rename/add roles:

1. **Update Database Enum:**
   ```sql
   ALTER TYPE user_role ADD VALUE 'model';
   ```

2. **Update `src/lib/roles.ts`:**
   ```typescript
   export const ROLES = {
     // ... existing roles
     MODEL: 'model',
   } as const;
   ```

3. **Add Dashboard Route:**
   ```tsx
   <Route path="/dashboard/model/overview" element={...} />
   ```

4. **Update Access Matrix:**
   ```typescript
   model: [ROLES.MODEL, ROLES.ADMIN],
   ```

5. **Data Migration:**
   ```sql
   -- Migrate old role to new role
   UPDATE profiles SET role = 'model' WHERE role = 'designer' AND <condition>;
   ```

---

## Reference Links

- [Clerk Role Documentation](https://clerk.com/docs/organizations/roles-permissions)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Our Implementation: `src/lib/roles.ts`](../src/lib/roles.ts)
