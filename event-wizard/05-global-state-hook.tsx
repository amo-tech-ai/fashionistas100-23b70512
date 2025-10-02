# 5. Global State Hook (Following CopilotKit Pattern)

```typescript
// src/hooks/use-global-state.tsx
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  OrganizerData, 
  EventData, 
  VenueData, 
  TicketData, 
  SponsorsMediaData,
  ReviewData 
} from '@/lib/validation/schemas';

// Define all wizard stages
export const WIZARD_STAGES = [
  'organizerSetup',
  'eventSetup',
  'venueSetup',
  'ticketSetup',
  'sponsorsMedia',
  'reviewPublish'
] as const;

export type WizardStage = typeof WIZARD_STAGES[number];

// Stage weights for progress calculation
export const STAGE_WEIGHTS: Record<WizardStage, number> = {
  organizerSetup: 15,
  eventSetup: 20,
  venueSetup: 15,
  ticketSetup: 20,
  sponsorsMedia: 15,
  reviewPublish: 15
};

// Global state interface
interface WizardState {
  // Session management
  sessionId: string | null;
  userId: string | null;
  organizationId: string | null;
  
  // Current stage
  stage: WizardStage;
  completedStages: WizardStage[];
  
  // Stage data
  organizerData: Partial<OrganizerData>;
  eventData: Partial<EventData>;
  venueData: Partial<VenueData>;
  ticketData: Partial<TicketData>;
  sponsorsMediaData: Partial<SponsorsMediaData>;
  reviewData: Partial<ReviewData>;
  
  // Progress tracking
  completionDetails: Record<WizardStage, number>;
  completionPercentage: number;
  
  // Event result
  publishedEventId: string | null;
  
  // Status
  isLoading: boolean;
  error: string | null;
  lastSaved: Date | null;
  
  // Actions
  setStage: (stage: WizardStage) => void;
  setOrganizerData: (data: Partial<OrganizerData>) => void;
  setEventData: (data: Partial<EventData>) => void;
  setVenueData: (data: Partial<VenueData>) => void;
  setTicketData: (data: Partial<TicketData>) => void;
  setSponsorsMediaData: (data: Partial<SponsorsMediaData>) => void;
  setReviewData: (data: Partial<ReviewData>) => void;
  
  // Stage navigation
  nextStage: () => void;
  previousStage: () => void;
  goToStage: (stage: WizardStage) => void;
  
  // Session management
  initSession: (sessionId: string, userId: string) => void;
  clearSession: () => void;
  
  // Progress
  updateProgress: (stage: WizardStage, percentage: number) => void;
  calculateTotalProgress: () => number;
  
  // Persistence
  saveToBackend: () => Promise<void>;
  loadFromBackend: (sessionId: string) => Promise<void>;
  
  // Publishing
  publishEvent: () => Promise<string | null>;
}

// Create the store
export const useGlobalState = create<WizardState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        sessionId: null,
        userId: null,
        organizationId: null,
        stage: 'organizerSetup',
        completedStages: [],
        organizerData: {},
        eventData: {},
        venueData: {},
        ticketData: {},
        sponsorsMediaData: {},
        reviewData: {},
        completionDetails: {
          organizerSetup: 0,
          eventSetup: 0,
          venueSetup: 0,
          ticketSetup: 0,
          sponsorsMedia: 0,
          reviewPublish: 0
        },
        completionPercentage: 0,
        publishedEventId: null,
        isLoading: false,
        error: null,
        lastSaved: null,
        
        // Set stage
        setStage: (stage) => set({ 
          stage,
          error: null 
        }),
        
        // Set stage data
        setOrganizerData: (data) => set((state) => ({
          organizerData: { ...state.organizerData, ...data }
        })),
        
        setEventData: (data) => set((state) => ({
          eventData: { ...state.eventData, ...data }
        })),
        
        setVenueData: (data) => set((state) => ({
          venueData: { ...state.venueData, ...data }
        })),
        
        setTicketData: (data) => set((state) => ({
          ticketData: { ...state.ticketData, ...data }
        })),
        
        setSponsorsMediaData: (data) => set((state) => ({
          sponsorsMediaData: { ...state.sponsorsMediaData, ...data }
        })),
        
        setReviewData: (data) => set((state) => ({
          reviewData: { ...state.reviewData, ...data }
        })),
        
        // Navigation
        nextStage: () => {
          const { stage, completedStages } = get();
          const currentIndex = WIZARD_STAGES.indexOf(stage);
          
          if (currentIndex < WIZARD_STAGES.length - 1) {
            const nextStage = WIZARD_STAGES[currentIndex + 1];
            
            // Mark current stage as completed
            if (!completedStages.includes(stage)) {
              set((state) => ({
                completedStages: [...state.completedStages, stage],
                stage: nextStage
              }));
            } else {
              set({ stage: nextStage });
            }
            
            // Auto-save on stage change
            get().saveToBackend();
          }
        },
        
        previousStage: () => {
          const { stage } = get();
          const currentIndex = WIZARD_STAGES.indexOf(stage);
          
          if (currentIndex > 0) {
            set({ stage: WIZARD_STAGES[currentIndex - 1] });
          }
        },
        
        goToStage: (stage) => {
          const { completedStages } = get();
          const targetIndex = WIZARD_STAGES.indexOf(stage);
          
          // Can only go to completed stages or the next uncompleted stage
          const maxAllowedIndex = completedStages.length;
          
          if (targetIndex <= maxAllowedIndex) {
            set({ stage });
          } else {
            set({ error: 'Cannot skip ahead to this stage' });
          }
        },
        
        // Session management
        initSession: (sessionId, userId) => {
          set({
            sessionId,
            userId,
            stage: 'organizerSetup',
            completedStages: [],
            error: null
          });
        },
        
        clearSession: () => {
          set({
            sessionId: null,
            userId: null,
            organizationId: null,
            stage: 'organizerSetup',
            completedStages: [],
            organizerData: {},
            eventData: {},
            venueData: {},
            ticketData: {},
            sponsorsMediaData: {},
            reviewData: {},
            completionDetails: {
              organizerSetup: 0,
              eventSetup: 0,
              venueSetup: 0,
              ticketSetup: 0,
              sponsorsMedia: 0,
              reviewPublish: 0
            },
            completionPercentage: 0,
            publishedEventId: null,
            error: null
          });
        },
        
        // Progress tracking
        updateProgress: (stage, percentage) => {
          set((state) => {
            const newDetails = {
              ...state.completionDetails,
              [stage]: percentage
            };
            
            // Calculate weighted total
            const total = Object.entries(newDetails).reduce((sum, [key, value]) => {
              const weight = STAGE_WEIGHTS[key as WizardStage];
              return sum + (value * weight) / 100;
            }, 0);
            
            return {
              completionDetails: newDetails,
              completionPercentage: Math.round(total)
            };
          });
        },
        
        calculateTotalProgress: () => {
          const { completionDetails } = get();
          
          const total = Object.entries(completionDetails).reduce((sum, [key, value]) => {
            const weight = STAGE_WEIGHTS[key as WizardStage];
            return sum + (value * weight) / 100;
          }, 0);
          
          return Math.round(total);
        },
        
        // Backend persistence
        saveToBackend: async () => {
          const state = get();
          
          if (!state.sessionId) {
            set({ error: 'No session ID' });
            return;
          }
          
          set({ isLoading: true, error: null });
          
          try {
            const response = await fetch('/api/wizard-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                op: 'update_stage_data',
                sessionId: state.sessionId,
                data: {
                  stage: state.stage,
                  stageData: {
                    organizer: state.organizerData,
                    event: state.eventData,
                    venue: state.venueData,
                    ticket: state.ticketData,
                    sponsor: state.sponsorsMediaData,
                    review: state.reviewData
                  }
                }
              })
            });
            
            if (!response.ok) {
              throw new Error('Failed to save');
            }
            
            set({ 
              lastSaved: new Date(),
              isLoading: false 
            });
            
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Save failed',
              isLoading: false 
            });
          }
        },
        
        loadFromBackend: async (sessionId) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await fetch(`/api/wizard-session?sessionId=${sessionId}`);
            
            if (!response.ok) {
              throw new Error('Session not found');
            }
            
            const session = await response.json();
            
            set({
              sessionId: session.session_id,
              userId: session.user_id,
              organizationId: session.organization_id,
              stage: session.current_stage,
              completedStages: session.completed_stages || [],
              organizerData: session.organizer_data || {},
              eventData: session.event_data || {},
              venueData: session.venue_data || {},
              ticketData: session.ticket_data || {},
              sponsorsMediaData: session.sponsor_data || {},
              reviewData: {},
              completionDetails: session.completion_details || {},
              completionPercentage: session.completion_percentage || 0,
              isLoading: false
            });
            
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Load failed',
              isLoading: false 
            });
          }
        },
        
        // Publish event
        publishEvent: async () => {
          const state = get();
          
          if (!state.sessionId) {
            set({ error: 'No session ID' });
            return null;
          }
          
          set({ isLoading: true, error: null });
          
          try {
            const response = await fetch('/api/wizard-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                op: 'publish',
                sessionId: state.sessionId
              })
            });
            
            if (!response.ok) {
              throw new Error('Failed to publish');
            }
            
            const { event } = await response.json();
            
            set({ 
              publishedEventId: event.id,
              isLoading: false 
            });
            
            return event.id;
            
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Publish failed',
              isLoading: false 
            });
            return null;
          }
        }
      }),
      {
        name: 'event-wizard-storage',
        partialize: (state) => ({
          sessionId: state.sessionId,
          stage: state.stage,
          completedStages: state.completedStages,
          organizerData: state.organizerData,
          eventData: state.eventData,
          venueData: state.venueData,
          ticketData: state.ticketData,
          sponsorsMediaData: state.sponsorsMediaData,
          reviewData: state.reviewData
        })
      }
    )
  )
);
```