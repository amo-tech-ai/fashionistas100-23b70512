import { OrganizerProfile } from "@/components/generative-ui/organizer-profile";
import { useGlobalState } from "@/lib/stages";
import { useCopilotAction, useCopilotAdditionalInstructions, useCopilotReadable } from "@copilotkit/react-core";
import { z } from "zod";
import { useEffect, useCallback } from "react";
import { debounce } from "@/lib/utils";

// Validation schema
const OrganizerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  organization: z.string().optional(),
  role: z.enum(["organizer", "designer", "brand", "agency"]),
  experience: z.enum(["first_time", "occasional", "professional"]).optional(),
});

type OrganizerData = z.infer<typeof OrganizerSchema>;

/**
 * Stage 1: Collect organizer information with validation and autosave
 * Next: eventSetup
 */
export function useStageOrganizerSetup() {
  const { 
    organizerInfo,
    setOrganizerInfo, 
    setBrandInfo,
    stage, 
    setStage,
    sessionId 
  } = useGlobalState();

  // Autosave to localStorage
  const autoSave = useCallback(
    debounce((data: Partial<OrganizerData>) => {
      if (data && Object.keys(data).length > 0) {
        localStorage.setItem(`wizard_organizer_${sessionId}`, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      }
    }, 1000),
    [sessionId]
  );

  // Resume from saved draft
  useEffect(() => {
    const saved = localStorage.getItem(`wizard_organizer_${sessionId}`);
    if (saved && !organizerInfo) {
      try {
        const { data } = JSON.parse(saved);
        setOrganizerInfo(data);
      } catch (e) {
        console.error("Failed to restore organizer data:", e);
      }
    }
  }, [sessionId, organizerInfo, setOrganizerInfo]);

  // Track stage entry
  useEffect(() => {
    if (stage === "organizerSetup") {
      console.log('Entered organizer setup stage', { sessionId });
    }
  }, [stage, sessionId]);

  // AI Instructions
  useCopilotAdditionalInstructions(
    {
      instructions: `
        CURRENT STATE: Setting up event organizer profile.
        
        START: "Welcome to FashionOS! Let's create your event in under 3 minutes. First, tell me about yourself."
        
        COLLECT:
        - Name (required)
        - Email (required) 
        - Organization (optional)
        - Role: organizer, designer, brand, or agency
        
        MENTION: "If you use a business email, I can auto-import your brand details."
        
        TONE: Friendly, encouraging, brief.
      `,
      available: stage === "organizerSetup" ? "enabled" : "disabled",
    },
    [stage],
  );

  // Make current data readable to AI
  useCopilotReadable(
    {
      description: "Current organizer info",
      value: organizerInfo || {},
      available: stage === "organizerSetup" ? "enabled" : "disabled",
    },
    [stage, organizerInfo]
  );

  // Main action
  useCopilotAction(
    {
      name: "setupOrganizer",
      description: "Collect and validate organizer information",
      available: stage === "organizerSetup" ? "enabled" : "disabled",
      renderAndWaitForResponse: ({ status, respond }) => {
        const startTime = Date.now();
        
        return (
          <OrganizerProfile
            status={status}
            onValidate={(data: OrganizerData) => {
              // Validate with Zod
              try {
                const validated = OrganizerSchema.parse(data);
                return { valid: true, data: validated };
              } catch (error) {
                if (error instanceof z.ZodError) {
                  return { 
                    valid: false, 
                    errors: error.errors.map(e => e.message)
                  };
                }
                return { valid: false, errors: ["Validation failed"] };
              }
            }}
            onChange={(data: Partial<OrganizerData>) => {
              // Trigger autosave on changes
              autoSave(data);
            }}
            onSubmit={async (data: OrganizerData) => {
              // Validate final submission
              try {
                const validated = OrganizerSchema.parse(data);
                
                // Store validated data
                setOrganizerInfo(validated);
                
                // Try brand auto-import from email domain
                const domain = validated.email.split('@')[1];
                if (domain && !['gmail.com', 'yahoo.com', 'outlook.com'].includes(domain)) {
                  try {
                    const response = await fetch(`/api/brand/import?domain=${domain}`);
                    if (response.ok) {
                      const brand = await response.json();
                      setBrandInfo(brand);
                      respond?.(`Great! I found and imported ${brand.name}'s brand details.`);
                    }
                  } catch (e) {
                    // Silent fail - not critical
                  }
                }
                
                // Track completion
                console.log('Wizard stage completed', {
                  stage: 'organizerSetup',
                  duration: Date.now() - startTime,
                  role: validated.role,
                  hasBrand: !!domain,
                  sessionId
                });
                
                // Clear autosave
                localStorage.removeItem(`wizard_organizer_${sessionId}`);
                
                respond?.("Perfect! Your profile is ready. Let's create your event!");
                setStage("eventSetup");
                
              } catch (error) {
                respond?.("Please check your information and try again.");
              }
            }}
            onSkip={() => {
              // Allow skip with minimal data
              if (organizerInfo?.email) {
                setStage("eventSetup");
              } else {
                respond?.("Please provide at least your email to continue.");
              }
            }}
          />
        );
      },
    },
    [stage, organizerInfo, sessionId],
  );
}
