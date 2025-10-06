import { EventBuilder } from "@/components/generative-ui/event-builder";
import { EventTypeSelector } from "@/components/generative-ui/event-type-selector";
import { useGlobalState } from "@/lib/stages";
import {
  useCopilotAction,
  useCopilotAdditionalInstructions,
  useCopilotReadable,
} from "@copilotkit/react-core";
import { z } from "zod";
import { useEffect, useCallback } from "react";
import { debounce } from "@/lib/utils";

// Validation schema
const EventDetailsSchema = z.object({
  title: z.string().min(3, "Event title must be at least 3 characters"),
  type: z.enum(["fashion_show", "popup", "exhibition", "launch"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM format").optional(),
  timezone: z.string().default("America/New_York"),
  description: z.string().optional(),
});

type EventDetailsData = z.infer<typeof EventDetailsSchema>;

/**
 * Stage 2: Build the event details with validation and autosave
 * Next: ticketSetup
 */
export function useStageEventSetup() {
  const { 
    eventInfo,
    setEventInfo, 
    organizerInfo,
    stage, 
    setStage,
    sessionId 
  } = useGlobalState();

  // Autosave to localStorage
  const autoSave = useCallback(
    debounce((data: Partial<EventDetailsData>) => {
      if (data && Object.keys(data).length > 0) {
        localStorage.setItem(`wizard_event_${sessionId}`, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      }
    }, 1000),
    [sessionId]
  );

  // Resume from saved draft
  useEffect(() => {
    const saved = localStorage.getItem(`wizard_event_${sessionId}`);
    if (saved && !eventInfo) {
      try {
        const { data } = JSON.parse(saved);
        setEventInfo(data);
      } catch (e) {
        console.error("Failed to restore event data:", e);
      }
    }
  }, [sessionId, eventInfo, setEventInfo]);

  // Track stage entry
  useEffect(() => {
    if (stage === "eventSetup") {
      console.log('Entered event setup stage', { sessionId });
    }
  }, [stage, sessionId]);

  // AI Instructions
  useCopilotAdditionalInstructions(
    {
      instructions: `
        CURRENT STATE: Setting up the fashion event details.
        
        START: "Perfect! Now let's create your event. What type of fashion event are you planning?"
        
        COLLECT:
        1. Event type (Fashion Show, Pop-up, Exhibition, Launch Party)
        2. Event title (required)
        3. Date (YYYY-MM-DD format)
        4. Start time (HH:MM format)
        5. End time (optional)
        6. Timezone (default: America/New_York)
        
        VALIDATE: Ensure date is in future, times are valid 24hr format.
        
        TONE: Enthusiastic but efficient. Guide them through quickly.
      `,
      available: stage === "eventSetup" ? "enabled" : "disabled",
    },
    [stage],
  );

  // Make current draft readable to AI
  useCopilotReadable(
    {
      description: "Current event draft",
      value: eventInfo || {},
      available: stage === "eventSetup" ? "enabled" : "disabled",
    },
    [stage, eventInfo]
  );

  // Expose organizer context
  useCopilotReadable(
    {
      description: "Event organizer",
      value: organizerInfo || {},
      available: stage === "eventSetup" ? "enabled" : "disabled",
    },
    [stage, organizerInfo]
  );

  // Event type selection action
  useCopilotAction(
    {
      name: "selectEventType",
      description: "Show event type options",
      available: stage === "eventSetup" ? "enabled" : "disabled",
      renderAndWaitForResponse: ({ status, respond }) => {
        return (
          <EventTypeSelector
            status={status}
            types={[
              { id: 'fashion_show', label: 'Fashion Show', icon: '👗', description: 'Runway presentations' },
              { id: 'popup', label: 'Pop-up Shop', icon: '🛍️', description: 'Temporary retail' },
              { id: 'exhibition', label: 'Exhibition', icon: '🎨', description: 'Gallery showcase' },
              { id: 'launch', label: 'Launch Party', icon: '🥂', description: 'Product debut' }
            ]}
            onSelect={(type) => {
              setEventInfo({ ...eventInfo, type: type as any });
              autoSave({ type: type as any });
              respond?.(`Great choice! A ${type.replace('_', ' ')} it is. Now let's add the details.`);
            }}
          />
        );
      },
    },
    [stage, eventInfo],
  );

  // Event details configuration action
  useCopilotAction(
    {
      name: "configureEvent",
      description: "Set event details with validation",
      available: stage === "eventSetup" ? "enabled" : "disabled",
      parameters: [
        { name: "title", type: "string", required: true, description: "Event name" },
        { name: "type", type: "string", required: true, description: "Event type" },
        { name: "date", type: "string", required: true, description: "Date in YYYY-MM-DD" },
        { name: "startTime", type: "string", required: true, description: "Start time in HH:MM" },
        { name: "endTime", type: "string", required: false, description: "End time in HH:MM" },
        { name: "timezone", type: "string", required: false, description: "Timezone (default: America/New_York)" },
      ],
      renderAndWaitForResponse: ({ args, status, respond }) => {
        const startTime = Date.now();
        
        return (
          <EventBuilder
            status={status}
            initialData={{...eventInfo, ...args}}
            onValidate={(data: Partial<EventDetailsData>) => {
              // Validate with Zod
              try {
                const validated = EventDetailsSchema.parse(data);
                
                // Check date is in future
                const eventDate = new Date(validated.date);
                if (eventDate < new Date()) {
                  return { 
                    valid: false, 
                    errors: ["Event date must be in the future"] 
                  };
                }
                
                // Check end time is after start time if provided
                if (validated.endTime && validated.endTime <= validated.startTime) {
                  return { 
                    valid: false, 
                    errors: ["End time must be after start time"] 
                  };
                }
                
                return { valid: true, errors: [] };
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
            onChange={(data: Partial<EventDetailsData>) => {
              // Trigger autosave on changes
              autoSave(data);
            }}
            onComplete={async (details) => {
              // Final validation
              const parsed = EventDetailsSchema.safeParse(details);
              if (!parsed.success) {
                respond?.("Please check your event details. " + 
                  parsed.error.errors.map(e => e.message).join(", "));
                return;
              }
              
              // Save validated data
              setEventInfo(parsed.data);
              
              // Save to backend
              try {
                await fetch("/api/wizard/save", {
                  method: "POST",
                  headers: {"Content-Type": "application/json"},
                  body: JSON.stringify({ 
                    stage: "eventSetup", 
                    sessionId,
                    data: parsed.data 
                  }),
                });
              } catch (e) {
                console.error("Failed to save to backend:", e);
              }
              
              // Track completion
              console.log('Event setup completed', {
                stage: 'eventSetup',
                duration: Date.now() - startTime,
                eventType: parsed.data.type,
                hasEndTime: !!parsed.data.endTime,
                timezone: parsed.data.timezone,
                sessionId
              });
              
              // Clear autosave
              localStorage.removeItem(`wizard_event_${sessionId}`);
              
              respond?.(`Perfect! "${parsed.data.title}" is configured for ${parsed.data.date}. Let's set up ticketing!`);
              setStage("ticketSetup");
            }}
          />
        );
      },
    },
    [stage, eventInfo, sessionId],
  );
}
