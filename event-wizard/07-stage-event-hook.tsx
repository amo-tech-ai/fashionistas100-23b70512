# 7. Stage Hook: Event Setup

```typescript
// src/hooks/stages/use-stage-event.tsx
import { 
  useCopilotAction, 
  useCopilotAdditionalInstructions, 
  useCopilotReadable 
} from "@copilotkit/react-core";
import { useGlobalState } from "../use-global-state";
import { EventSchema } from "@/lib/validation/schemas";

export function useStageEvent() {
  const {
    stage,
    organizerData,
    eventData,
    setEventData,
    nextStage,
    previousStage,
    updateProgress,
    saveToBackend,
    completionPercentage
  } = useGlobalState();
  
  const isActive = stage === 'eventSetup';
  
  // Stage-specific instructions
  useCopilotAdditionalInstructions({
    instructions: `
      CURRENT STATE: Event Details (Step 2 of 6)
      PROGRESS: ${completionPercentage}% complete overall
      
      TASK: Help create event details
      - Event title
      - Event type (fashion_show, popup, exhibition, launch)
      - Date (must be future)
      - Start time and optional end time
      - Timezone
      - Description (optional)
      
      ORGANIZER CONTEXT:
      - Name: ${organizerData.name}
      - Organization: ${organizerData.organization || 'Individual'}
      - Role: ${organizerData.role}
      
      VALIDATION:
      - Title: 3-255 characters
      - Date: Must be in the future
      - Time: HH:MM format (24-hour)
      - End time: Must be after start time
      
      SUGGESTIONS:
      - Fashion shows typically 7-9 PM
      - Pop-ups usually daytime
      - Exhibitions span multiple days
      - Launches evening events
    `,
    available: isActive ? "enabled" : "disabled"
  });
  
  // Expose context
  useCopilotReadable({
    description: "Event setup context",
    value: {
      currentData: eventData,
      organizerInfo: {
        name: organizerData.name,
        organization: organizerData.organization,
        role: organizerData.role
      },
      eventTypes: [
        { value: "fashion_show", label: "Fashion Show", typical: "Evening runway" },
        { value: "popup", label: "Pop-up Shop", typical: "Retail experience" },
        { value: "exhibition", label: "Exhibition", typical: "Multi-day showcase" },
        { value: "launch", label: "Launch Party", typical: "Product reveal" }
      ],
      timezones: Intl.supportedValuesOf('timeZone'),
      progress: {
        stageProgress: eventData.title && eventData.date ? 100 : 0,
        overallProgress: completionPercentage
      }
    },
    available: isActive ? "enabled" : "disabled"
  });
  
  // Primary action
  useCopilotAction({
    name: "completeEventSetup",
    description: "Save event details and move to venue setup",
    available: isActive ? "enabled" : "disabled",
    parameters: [
      { name: "title", type: "string", required: true },
      { name: "type", type: "string", required: true },
      { name: "date", type: "string", required: true },
      { name: "startTime", type: "string", required: true },
      { name: "endTime", type: "string", required: false },
      { name: "timezone", type: "string", required: true },
      { name: "description", type: "string", required: false }
    ],
    handler: async (params) => {
      try {
        const validated = EventSchema.parse(params);
        
        setEventData(validated);
        await updateProgress('eventSetup', 100);
        await saveToBackend();
        nextStage();
        
        return {
          success: true,
          message: `Event "${validated.title}" scheduled for ${validated.date}. Let's configure the venue.`
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
  
  // AI description generator
  useCopilotAction({
    name: "generateEventDescription",
    description: "Generate AI-powered event description",
    available: isActive ? "enabled" : "disabled",
    handler: async () => {
      const { title, type, date } = eventData;
      
      if (!title || !type) {
        return {
          success: false,
          message: "Please provide event title and type first"
        };
      }
      
      const templates = {
        fashion_show: `Experience an unforgettable evening at ${title}, featuring cutting-edge designs and innovative fashion. Join us for an exclusive runway presentation showcasing the latest collections.`,
        popup: `Discover unique fashion at ${title}, a curated pop-up experience bringing together emerging designers and exclusive pieces. Limited time only.`,
        exhibition: `Explore the intersection of fashion and art at ${title}. This immersive exhibition showcases visionary designs and creative expressions.`,
        launch: `Be among the first to experience ${title}. Join us for an exclusive launch event featuring new collections, special guests, and memorable moments.`
      };
      
      const description = templates[type as keyof typeof templates] || '';
      
      setEventData({ description });
      
      return {
        success: true,
        description
      };
    }
  });
  
  // Date/time suggestions
  useCopilotAction({
    name: "suggestEventTiming",
    description: "Suggest optimal date and time based on event type",
    available: isActive ? "enabled" : "disabled",
    parameters: [
      { name: "eventType", type: "string", required: true }
    ],
    handler: async ({ eventType }) => {
      const suggestions = {
        fashion_show: {
          dayOfWeek: "Thursday or Friday",
          time: "19:00",
          duration: "2 hours",
          reason: "Peak attendance for evening fashion events"
        },
        popup: {
          dayOfWeek: "Saturday or Sunday",
          time: "11:00",
          duration: "8 hours",
          reason: "Maximum foot traffic for retail"
        },
        exhibition: {
          dayOfWeek: "Any day",
          time: "10:00",
          duration: "Multiple days",
          reason: "Gallery hours for extended viewing"
        },
        launch: {
          dayOfWeek: "Thursday",
          time: "18:00",
          duration: "3 hours",
          reason: "After-work attendance for professionals"
        }
      };
      
      const suggestion = suggestions[eventType as keyof typeof suggestions];
      
      if (!suggestion) {
        return {
          success: false,
          message: "Invalid event type"
        };
      }
      
      return {
        success: true,
        suggestion,
        message: `For ${eventType}, we recommend: ${suggestion.dayOfWeek} at ${suggestion.time}`
      };
    }
  });
}
```