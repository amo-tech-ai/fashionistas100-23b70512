# 6. Stage Hook: Organizer Setup (Following CopilotKit Pattern)

```typescript
// src/hooks/stages/use-stage-organizer.tsx
import { 
  useCopilotAction, 
  useCopilotAdditionalInstructions, 
  useCopilotReadable 
} from "@copilotkit/react-core";
import { useGlobalState } from "../use-global-state";
import { OrganizerSchema } from "@/lib/validation/schemas";
import { useUser } from "@clerk/nextjs";
import { useMediaQuery } from "@/hooks/use-media-query";

export function useStageOrganizer() {
  const { user } = useUser();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const {
    stage,
    organizerData,
    setOrganizerData,
    nextStage,
    updateProgress,
    saveToBackend,
    completionPercentage
  } = useGlobalState();
  
  const isActive = stage === 'organizerSetup';
  
  // 1. Stage-specific instructions (CopilotKit pattern)
  useCopilotAdditionalInstructions({
    instructions: `
      CURRENT STATE: Organizer Setup (Step 1 of 6)
      PROGRESS: ${completionPercentage}% complete overall
      DEVICE: ${isMobile ? 'Mobile - keep responses brief' : 'Desktop'}
      
      TASK: Help user set up their organizer profile
      - Name (pre-filled from Clerk if available)
      - Email (pre-filled from Clerk if available)  
      - Organization (optional)
      - Role selection
      
      USER CONTEXT:
      ${user ? `
        - Authenticated as: ${user.fullName || 'User'}
        - Email: ${user.primaryEmailAddress?.emailAddress}
        - Organization: ${user.organizationMemberships?.[0]?.organization?.name || 'Not set'}
      ` : '- Not authenticated yet'}
      
      VALIDATION RULES:
      - Name: 2-100 characters
      - Email: Valid email format
      - Role: Must select from available options
      
      IMPORTANT: If user is authenticated via Clerk, suggest using their profile data.
    `,
    available: isActive ? "enabled" : "disabled"
  });
  
  // 2. Expose current context (CopilotKit readable)
  useCopilotReadable({
    description: "Organizer setup context",
    value: {
      currentData: organizerData,
      clerkProfile: user ? {
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        organization: user.organizationMemberships?.[0]?.organization?.name
      } : null,
      validationSchema: {
        name: "2-100 characters",
        email: "Valid email required",
        organization: "Optional, 2-100 characters",
        role: ["event_organizer", "fashion_designer", "brand_representative", "agency"]
      },
      progress: {
        stageProgress: organizerData.name && organizerData.email ? 100 : 0,
        overallProgress: completionPercentage
      },
      device: {
        isMobile,
        platform: navigator.userAgent
      }
    },
    available: isActive ? "enabled" : "disabled"
  });
  
  // 3. Primary action - complete organizer setup
  useCopilotAction({
    name: "completeOrganizerSetup",
    description: "Save organizer information and proceed to event setup",
    available: isActive ? "enabled" : "disabled",
    parameters: [
      {
        name: "name",
        type: "string",
        description: "Full name of the organizer",
        required: true
      },
      {
        name: "email",
        type: "string",
        description: "Email address",
        required: true
      },
      {
        name: "organization",
        type: "string",
        description: "Organization name (optional)",
        required: false
      },
      {
        name: "role",
        type: "string",
        description: "Role: event_organizer, fashion_designer, brand_representative, or agency",
        required: true
      }
    ],
    handler: async (params) => {
      try {
        // Validate with Zod
        const validated = OrganizerSchema.parse(params);
        
        // Update local state
        setOrganizerData(validated);
        
        // Update progress
        await updateProgress('organizerSetup', 100);
        
        // Save to backend
        await saveToBackend();
        
        // Move to next stage
        nextStage();
        
        return {
          success: true,
          message: `Great! Welcome ${validated.name}. Let's set up your event details.`
        };
        
      } catch (error) {
        if (error instanceof Error) {
          const zodError = error as any;
          if (zodError.errors) {
            return {
              success: false,
              errors: zodError.errors.map((e: any) => ({
                field: e.path.join('.'),
                message: e.message
              }))
            };
          }
        }
        throw error;
      }
    }
  });
  
  // 4. Helper action - prefill from Clerk
  useCopilotAction({
    name: "prefillFromClerk",
    description: "Use authenticated user's profile data",
    available: isActive && user ? "enabled" : "disabled",
    handler: async () => {
      if (!user) {
        return {
          success: false,
          message: "No authenticated user found"
        };
      }
      
      const prefillData = {
        name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        organization: user.organizationMemberships?.[0]?.organization?.name || ''
      };
      
      setOrganizerData(prefillData);
      
      return {
        success: true,
        message: "Profile data loaded from your account",
        data: prefillData
      };
    }
  });
  
  // 5. Autosave action
  useCopilotAction({
    name: "autosaveOrganizerData",
    description: "Save current progress without advancing",
    available: isActive ? "enabled" : "disabled",
    parameters: [
      {
        name: "data",
        type: "object",
        description: "Partial organizer data to save",
        required: true
      }
    ],
    handler: async ({ data }) => {
      setOrganizerData(data);
      
      // Calculate stage progress
      const hasName = !!data.name;
      const hasEmail = !!data.email;
      const hasRole = !!data.role;
      
      const progress = (
        (hasName ? 33 : 0) +
        (hasEmail ? 33 : 0) +
        (hasRole ? 34 : 0)
      );
      
      await updateProgress('organizerSetup', progress);
      await saveToBackend();
      
      return "Progress saved";
    }
  });
  
  // 6. Role suggestion action
  useCopilotAction({
    name: "suggestRole",
    description: "Suggest appropriate role based on organization",
    available: isActive ? "enabled" : "disabled",
    parameters: [
      {
        name: "organization",
        type: "string",
        description: "Organization name",
        required: false
      }
    ],
    handler: async ({ organization }) => {
      const suggestions = {
        agency: ["agency", "event_organizer"],
        studio: ["fashion_designer", "brand_representative"],
        brand: ["brand_representative", "event_organizer"],
        default: ["event_organizer"]
      };
      
      let suggestedRoles = suggestions.default;
      
      if (organization) {
        const lowerOrg = organization.toLowerCase();
        
        if (lowerOrg.includes('agency')) {
          suggestedRoles = suggestions.agency;
        } else if (lowerOrg.includes('studio') || lowerOrg.includes('design')) {
          suggestedRoles = suggestions.studio;
        } else if (lowerOrg.includes('brand') || lowerOrg.includes('fashion')) {
          suggestedRoles = suggestions.brand;
        }
      }
      
      return {
        suggestions: suggestedRoles,
        message: `Based on ${organization || 'your profile'}, we recommend: ${suggestedRoles[0]}`
      };
    }
  });
}
```