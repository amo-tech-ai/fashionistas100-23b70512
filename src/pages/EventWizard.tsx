import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { OrganizerSetup } from "@/components/wizard/OrganizerSetup";
import { EventDetails } from "@/components/wizard/EventDetails";
import { VenueConfiguration } from "@/components/wizard/VenueConfiguration";
import { TicketSetup } from "@/components/wizard/TicketSetup";
import { SponsorsMedia } from "@/components/wizard/SponsorsMedia";
import { ReviewPublish } from "@/components/wizard/ReviewPublish";

const STAGES = [
  { id: 1, title: "Organizer Setup" },
  { id: 2, title: "Event Details" },
  { id: 3, title: "Venue Configuration" },
  { id: 4, title: "Ticket Setup" },
  { id: 5, title: "Sponsors & Media" },
  { id: 6, title: "Review & Publish" },
];

export default function EventWizard() {
  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState({
    organizer: {},
    event: {},
    venue: {},
    tickets: {},
    sponsors: {},
  });
  const navigate = useNavigate();

  const updateFormData = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], ...data },
    }));
  };

  const handleNext = () => {
    if (currentStage < 6) {
      setCurrentStage(currentStage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData);
    // TODO: Implement draft saving
  };

  const handlePublish = () => {
    console.log("Publishing event:", formData);
    // TODO: Implement event publishing
    navigate("/dashboard");
  };

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return (
          <OrganizerSetup
            data={formData.organizer}
            onUpdate={(data) => updateFormData("organizer", data)}
          />
        );
      case 2:
        return (
          <EventDetails
            data={formData.event}
            onUpdate={(data) => updateFormData("event", data)}
          />
        );
      case 3:
        return (
          <VenueConfiguration
            data={formData.venue}
            onUpdate={(data) => updateFormData("venue", data)}
          />
        );
      case 4:
        return (
          <TicketSetup
            data={formData.tickets}
            onUpdate={(data) => updateFormData("tickets", data)}
          />
        );
      case 5:
        return (
          <SponsorsMedia
            data={formData.sponsors}
            onUpdate={(data) => updateFormData("sponsors", data)}
          />
        );
      case 6:
        return <ReviewPublish data={formData} onPublish={handlePublish} />;
      default:
        return null;
    }
  };

  const progressPercentage = (currentStage / 6) * 100;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-[#1A1A1A]">
                Step {currentStage} of 6
              </h2>
              <span className="text-sm text-[#1A1A1A]/60">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-[#E5E5E5]" />
            
            {/* Stage indicators */}
            <div className="flex justify-between mt-6">
              {STAGES.map((stage) => (
                <div
                  key={stage.id}
                  className={`flex flex-col items-center space-y-2 ${
                    stage.id <= currentStage ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      stage.id === currentStage
                        ? "bg-[#E85C2B] text-white"
                        : stage.id < currentStage
                        ? "bg-[#E85C2B]/20 text-[#E85C2B]"
                        : "bg-white border-2 border-[#E5E5E5] text-[#1A1A1A]/40"
                    }`}
                  >
                    {stage.id}
                  </div>
                  <span className="hidden md:block text-xs text-center max-w-[80px] text-[#1A1A1A]/60">
                    {stage.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stage Content */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 md:p-8 mb-6">
            <h1 className="text-2xl md:text-3xl font-light text-[#1A1A1A] mb-6">
              {STAGES[currentStage - 1].title}
            </h1>
            {renderStage()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button
              onClick={handleBack}
              disabled={currentStage === 1}
              variant="outline"
              className="border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#1A1A1A]/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex gap-4">
              <Button
                onClick={handleSaveDraft}
                variant="outline"
                className="border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#1A1A1A]/5"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>

              {currentStage < 6 ? (
                <Button
                  onClick={handleNext}
                  className="bg-[#E85C2B] hover:bg-[#d54e1f] text-white"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handlePublish}
                  className="bg-[#E85C2B] hover:bg-[#d54e1f] text-white"
                >
                  Publish Event
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
