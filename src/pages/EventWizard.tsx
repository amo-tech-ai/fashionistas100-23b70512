import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { useCopilotReadable } from "@copilotkit/react-core";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Progress } from "@/components/ui/progress";
import { useGlobalState, WizardStage } from "@/lib/stages";
import { OrganizerSetup } from "@/components/wizard/OrganizerSetup";
import { EventDetails } from "@/components/wizard/EventDetails";
import { VenueConfiguration } from "@/components/wizard/VenueConfiguration";
import { TicketSetup } from "@/components/wizard/TicketSetup";
import { SponsorsMedia } from "@/components/wizard/SponsorsMedia";
import { ReviewPublish } from "@/components/wizard/ReviewPublish";

// Import stage hooks
import { useStageOrganizerSetup } from "../../event-wizard/stages/01-use-stage-organizer-setup";
import { useStageEventSetup } from "../../event-wizard/stages/02-use-stage-event-setup";
import { useStageTicketSetup } from "../../event-wizard/stages/03-use-stage-ticket-setup";
import { useStageVenueSetup } from "../../event-wizard/stages/04-use-stage-venue-setup";
import { useStagePaymentSetup } from "../../event-wizard/stages/05-use-stage-payment-setup";
import { useStageReviewPublish } from "../../event-wizard/stages/06-use-stage-review-publish";

const STAGES = [
  { id: 'organizerSetup', title: "Organizer Setup" },
  { id: 'eventSetup', title: "Event Details" },
  { id: 'venueSetup', title: "Venue Configuration" },
  { id: 'ticketSetup', title: "Ticket Setup" },
  { id: 'sponsorSetup', title: "Sponsors & Media" },
  { id: 'reviewPublish', title: "Review & Publish" },
];

function EventWizardContent() {
  const { 
    stage,
    organizerInfo,
    eventInfo,
    venueInfo,
    ticketInfo,
    sponsorInfo,
    paymentMethod,
    setOrganizerInfo,
    setEventInfo,
    setVenueInfo,
    setTicketInfo,
    setSponsorInfo,
  } = useGlobalState();

  // Global readable context for ALL stages (NO dependency array per cookbook)
  useCopilotReadable({
    description: "Complete event wizard state",
    value: {
      currentStage: stage,
      organizer: organizerInfo,
      event: eventInfo,
      venue: venueInfo,
      tickets: ticketInfo,
      sponsors: sponsorInfo,
      payment: paymentMethod,
    }
  });

  // Initialize ALL stage hooks - they control themselves via 'available' prop
  useStageOrganizerSetup();  // Stage 1
  useStageEventSetup();       // Stage 2
  useStageTicketSetup();      // Stage 3
  useStageVenueSetup();       // Stage 4
  useStagePaymentSetup();     // Stage 5
  useStageReviewPublish();    // Stage 6

  const currentStageIndex = STAGES.findIndex(s => s.id === stage);
  const progressPercentage = ((currentStageIndex + 1) / STAGES.length) * 100;

  // Render current stage content
  let stageContent = null;
  switch (stage) {
    case 'organizerSetup':
      stageContent = (
        <OrganizerSetup
          data={organizerInfo || {}}
          onUpdate={(data) => setOrganizerInfo({ ...organizerInfo, ...data })}
        />
      );
      break;
    case 'eventSetup':
      stageContent = (
        <EventDetails
          data={eventInfo || {}}
          onUpdate={(data) => setEventInfo({ ...eventInfo, ...data })}
        />
      );
      break;
    case 'venueSetup':
      stageContent = (
        <VenueConfiguration
          data={venueInfo || {}}
          onUpdate={(data) => setVenueInfo({ ...venueInfo, ...data })}
        />
      );
      break;
    case 'ticketSetup':
      stageContent = (
        <TicketSetup
          data={ticketInfo || {}}
          onUpdate={(data) => setTicketInfo({ ...ticketInfo, ...data })}
        />
      );
      break;
    case 'sponsorSetup':
      stageContent = (
        <SponsorsMedia
          data={sponsorInfo || {}}
          onUpdate={(data) => setSponsorInfo({ ...sponsorInfo, ...data })}
        />
      );
      break;
    case 'reviewPublish':
      stageContent = (
        <ReviewPublish
          data={{
            organizer: organizerInfo,
            event: eventInfo,
            venue: venueInfo,
            tickets: ticketInfo,
            sponsors: sponsorInfo,
          }}
          onPublish={() => {
            console.log("Publishing event...");
          }}
        />
      );
      break;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <CopilotSidebar
        defaultOpen={false}
        labels={{
          title: "Event Wizard Assistant",
          initial: "Hi! I'll help you create your event in under 3 minutes. What kind of event are you planning?"
        }}
      >
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-foreground">
                  Step {currentStageIndex + 1} of {STAGES.length}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              
              {/* Stage indicators */}
              <div className="flex justify-between mt-6">
                {STAGES.map((stageItem, index) => (
                  <div
                    key={stageItem.id}
                    className={`flex flex-col items-center space-y-2 ${
                      index <= currentStageIndex ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        stageItem.id === stage
                          ? "bg-primary text-primary-foreground"
                          : index < currentStageIndex
                          ? "bg-primary/20 text-primary"
                          : "bg-muted border-2 border-border text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="hidden md:block text-xs text-center max-w-[80px] text-muted-foreground">
                      {stageItem.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Content */}
            <div className="bg-card rounded-lg shadow-sm p-6 md:p-8 mb-6">
              <h1 className="text-2xl md:text-3xl font-light text-foreground mb-6">
                {STAGES[currentStageIndex]?.title}
              </h1>
              {stageContent}
            </div>
          </div>
        </div>
      </CopilotSidebar>

      <Footer />
    </div>
  );
}

// Removed renderStage() - moved logic inline to fix hook rendering error

export default function EventWizard() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  
  return (
    <CopilotKit runtimeUrl={`${supabaseUrl}/functions/v1/copilotkit`}>
      <EventWizardContent />
    </CopilotKit>
  );
}
