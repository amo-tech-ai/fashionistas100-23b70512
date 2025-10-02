# Stage 1 Conversion: Organizer Setup
## File: 01-use-stage-get-contact-info.tsx → 01-use-stage-organizer-setup.tsx

---

## CONVERSION CHECKLIST

### 1. File Rename
- [ ] Rename file to `01-use-stage-organizer-setup.tsx`

### 2. Import Updates
```typescript
// REMOVE
import { ContactInfo } from "@/components/generative-ui/contact-info";

// ADD
import { OrganizerProfile } from "@/components/generative-ui/organizer-profile";
import { SocialLoginButtons } from "@/components/generative-ui/social-login";
import { BrandAutoImport } from "@/services/brand-import";
```

### 3. Function Signature Changes
```typescript
// CURRENT
export function useStageGetContactInfo()

// NEW
export function useStageOrganizerSetup()
```

### 4. State Management Updates
```typescript
// CURRENT
const { setContactInfo, stage, setStage } = useGlobalState();

// NEW  
const { 
  setOrganizerInfo, 
  setBrandInfo,
  setAuthMethod,
  stage, 
  setStage 
} = useGlobalState();
```

### 5. Stage Name Updates
```typescript
// CURRENT
stage === "getContactInfo"

// NEW
stage === "organizerSetup"
```

### 6. Next Stage Update
```typescript
// CURRENT
setStage("buildCar");

// NEW
setStage("eventSetup");
```

### 7. AI Instructions Enhancement
```typescript
// CURRENT
instructions: "CURRENT STATE: You are now getting the contact information of the user."

// NEW
instructions: `
  CURRENT STATE: Setting up organizer profile.
  
  GREETING: "Welcome to FashionOS! I'll help you create your fashion event in under 3 minutes."
  
  APPROACH:
  1. Be warm and encouraging
  2. Mention we can auto-import brand details
  3. Keep conversation natural
  4. Focus on essentials only
  
  FIRST MESSAGE: "Hi! I'm your AI event assistant. Let's start by setting up your profile. Are you signing in with an existing account or creating a new one?"
`
```

### 8. Action Updates
```typescript
// CURRENT
name: "getContactInformation"

// NEW
name: "setupOrganizerProfile"
```

### 9. Component Replacement
```typescript
// CURRENT
<ContactInfo
  status={status}
  onSubmit={(name, email, phone) => {
    setContactInfo({ name, email, phone });
    respond?.("User has submitted their contact information.");
    setStage("buildCar");
  }}
/>

// NEW
<OrganizerProfile
  status={status}
  onSocialLogin={async (provider, profile) => {
    // Handle social authentication
    setAuthMethod(provider);
    setOrganizerInfo({
      name: profile.name,
      email: profile.email,
      organization: profile.company,
      profileImage: profile.picture
    });
    
    // Auto-import brand if business email
    if (!profile.email.includes('@gmail') && !profile.email.includes('@yahoo')) {
      const brandData = await BrandAutoImport.fetchFromDomain(profile.email);
      if (brandData) {
        setBrandInfo(brandData);
        respond?.("Great! I've imported your brand details automatically.");
      }
    }
    
    respond?.("Profile setup complete! Moving to event creation.");
    setStage("eventSetup");
  }}
  onManualSubmit={(data) => {
    setOrganizerInfo(data);
    respond?.("Profile created successfully!");
    setStage("eventSetup");
  }}
/>
```

### 10. New Data Types
```typescript
interface OrganizerInfo {
  name: string;
  email: string;
  organization?: string;
  role: 'organizer' | 'designer' | 'brand' | 'agency';
  experience: 'first_time' | 'occasional' | 'professional';
  profileImage?: string;
  socialProvider?: 'google' | 'apple' | 'facebook';
}

interface BrandInfo {
  name: string;
  logo: string;
  website: string;
  primaryColor: string;
  description?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}
```

---

## NEW COMPONENT: OrganizerProfile

### Visual Design (Breef-style)
```css
.organizer-profile-card {
  max-width: 640px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  border-radius: 8px;
  border: 1px solid #E5E5E5;
}

.social-login-section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #F5F5F5;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px;
  margin-bottom: 12px;
  border: 1px solid #E5E5E5;
  border-radius: 6px;
  background: white;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.social-button:hover {
  border-color: #E85C2B;
  background: #FFF5F0;
}

.divider {
  text-align: center;
  margin: 24px 0;
  color: #999;
  font-size: 14px;
}

.role-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.role-card {
  padding: 16px;
  border: 2px solid #E5E5E5;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.role-card.selected {
  border-color: #E85C2B;
  background: #FFF5F0;
}
```

---

## IMPLEMENTATION NOTES

### Priority Tasks
1. Create OrganizerProfile component
2. Implement social login (Clerk integration)
3. Build brand auto-import service
4. Update global state types
5. Test authentication flow

### Dependencies
- Clerk for authentication
- Brand import API
- Company data service (Clearbit/similar)

### Validation Rules
- Email format validation
- Organization name (optional for individuals)
- Role selection required
- Terms acceptance required

### Success Metrics
- Profile completion < 30 seconds
- Social login usage > 80%
- Brand auto-import success > 60%
- Drop-off rate < 5%

---

## MIGRATION SCRIPT

```bash
# 1. Backup current file
cp 01-use-stage-get-contact-info.tsx 01-use-stage-get-contact-info.backup.tsx

# 2. Create new file
cp 01-use-stage-get-contact-info.tsx 01-use-stage-organizer-setup.tsx

# 3. Update imports in dependent files
grep -r "useStageGetContactInfo" --include="*.tsx" --include="*.ts"

# 4. Update stage names globally
grep -r "getContactInfo" --include="*.tsx" --include="*.ts"
```

---

*This conversion transforms the basic contact form into a professional organizer onboarding experience with social login and brand intelligence.*