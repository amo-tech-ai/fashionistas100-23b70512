# Development Mode Authentication

## Mock Authentication Setup

For local development, you can bypass Clerk authentication while keeping all Clerk code intact.

### Enable Mock Auth

Add to your `.env` file:
```env
VITE_USE_MOCK_AUTH=true
```

### How It Works

When `VITE_USE_MOCK_AUTH=true`:
- ✅ All authentication is automatically bypassed
- ✅ You're auto-signed in as a test organizer user
- ✅ All protected routes are accessible
- ✅ All Clerk code remains intact
- ✅ All environment variables preserved

### Mock User Details

```javascript
{
  id: 'dev_mock_user_organizer',
  email: 'dev@fashionistas.test',
  firstName: 'Dev',
  lastName: 'Organizer',
  role: 'organizer'
}
```

### Disable Mock Auth

To use real Clerk authentication:

1. **Remove or set to false in `.env`:**
   ```env
   VITE_USE_MOCK_AUTH=false
   ```

2. **Or delete the line entirely**

3. **Restart your dev server**

### Console Indicators

When mock auth is active, you'll see:
```
🚧 DEV MODE: Mock Authentication ENABLED
🚧 All authentication bypassed - auto-signed in as test organizer
🚧 To disable: Remove VITE_USE_MOCK_AUTH from .env or set to false
```

### Production Safety

- Mock auth is **automatically disabled** in production builds
- Environment variable is ignored in production
- Real Clerk authentication is always used in production

### Testing Different Roles

To test different user roles, edit `src/lib/mock-clerk-provider.tsx`:

```typescript
const mockUser = {
  // ... other fields
  publicMetadata: {
    role: 'admin'  // Change to: 'organizer', 'admin', 'designer', etc.
  }
}
```

### Files Modified

1. **`src/lib/mock-clerk-provider.tsx`** - Mock Clerk provider implementation
2. **`src/main.tsx`** - Conditional provider selection
3. **`.env`** - Mock auth flag

### Troubleshooting

**Issue**: Still seeing login screen
- Check `.env` has `VITE_USE_MOCK_AUTH=true`
- Restart dev server after changing `.env`
- Clear browser cache/localStorage

**Issue**: Mock user not working
- Check console for "🚧 DEV MODE" messages
- Verify mock-clerk-provider.tsx is imported correctly

**Issue**: API calls failing
- Mock JWT token is `'mock_jwt_token'`
- Update API/Supabase to accept mock tokens in dev mode
