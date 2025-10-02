import { Button } from "@/components/ui/button";
import { Edit2, Check } from "lucide-react";

interface ReviewPublishProps {
  data: any;
  onPublish: () => void;
}

export function ReviewPublish({ data, onPublish }: ReviewPublishProps) {
  const eventData = data?.event || {};
  const venueData = data?.venue || {};
  const ticketsData = data?.tickets || {};
  const sponsorsData = data?.sponsors || {};
  
  return (
    <div className="space-y-6">
      <p className="text-sm text-[#1A1A1A]/60">
        Review your event details before publishing. You can edit any section by clicking the edit button.
      </p>

      {/* Event Info */}
      <div className="p-6 bg-[#FAF8F5] rounded-lg">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium text-[#1A1A1A]">Event Information</h3>
          <Button variant="ghost" size="sm" className="text-[#E85C2B] hover:bg-[#E85C2B]/10">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Event Title</p>
            <p className="text-sm text-[#1A1A1A]">{eventData.title || "Not set"}</p>
          </div>
          <div>
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Type</p>
            <p className="text-sm text-[#1A1A1A]">{eventData.type || "Not set"}</p>
          </div>
          <div>
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Date & Time</p>
            <p className="text-sm text-[#1A1A1A]">
              {eventData.date || "Not set"} at {eventData.startTime || "Not set"} - {eventData.endTime || "Not set"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Description</p>
            <p className="text-sm text-[#1A1A1A] line-clamp-3">
              {eventData.description || "Not set"}
            </p>
          </div>
        </div>
      </div>

      {/* Venue Details */}
      <div className="p-6 bg-[#FAF8F5] rounded-lg">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium text-[#1A1A1A]">Venue Details</h3>
          <Button variant="ghost" size="sm" className="text-[#E85C2B] hover:bg-[#E85C2B]/10">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Mode</p>
            <p className="text-sm text-[#1A1A1A] capitalize">{venueData.mode || "Not set"}</p>
          </div>
          {(venueData.mode === "physical" || venueData.mode === "hybrid") && (
            <>
              <div>
                <p className="text-xs text-[#1A1A1A]/60 mb-1">Venue Name</p>
                <p className="text-sm text-[#1A1A1A]">{venueData.venueName || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-[#1A1A1A]/60 mb-1">Address</p>
                <p className="text-sm text-[#1A1A1A]">{venueData.address || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-[#1A1A1A]/60 mb-1">Capacity</p>
                <p className="text-sm text-[#1A1A1A]">{venueData.capacity || 0} people</p>
              </div>
            </>
          )}
          {(venueData.mode === "virtual" || venueData.mode === "hybrid") && (
            <>
              <div>
                <p className="text-xs text-[#1A1A1A]/60 mb-1">Platform</p>
                <p className="text-sm text-[#1A1A1A]">{venueData.platform || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-[#1A1A1A]/60 mb-1">Stream URL</p>
                <p className="text-sm text-[#1A1A1A] truncate">{venueData.streamUrl || "Not set"}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Ticket Summary */}
      <div className="p-6 bg-[#FAF8F5] rounded-lg">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium text-[#1A1A1A]">Ticket Tiers</h3>
          <Button variant="ghost" size="sm" className="text-[#E85C2B] hover:bg-[#E85C2B]/10">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        {ticketsData.tiers && Array.isArray(ticketsData.tiers) && ticketsData.tiers.length > 0 ? (
          <div className="space-y-3">
            {ticketsData.tiers.map((tier: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">{tier.name || "Ticket"}</p>
                  <p className="text-xs text-[#1A1A1A]/60">{tier.quantity || 0} tickets available</p>
                </div>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {tier.price === "0" || tier.price === 0 ? "Free" : `$${tier.price} COP`}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#1A1A1A]/60">No tickets configured</p>
        )}
      </div>

      {/* Sponsors */}
      {sponsorsData.sponsors && Array.isArray(sponsorsData.sponsors) && sponsorsData.sponsors.length > 0 && (
        <div className="p-6 bg-[#FAF8F5] rounded-lg">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-medium text-[#1A1A1A]">Sponsors</h3>
            <Button variant="ghost" size="sm" className="text-[#E85C2B] hover:bg-[#E85C2B]/10">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="space-y-2">
            {sponsorsData.sponsors.map((sponsor: any, index: number) => (
              <div key={index} className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-[#E85C2B]" />
                <p className="text-sm text-[#1A1A1A]">{sponsor.name || "Sponsor"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publish Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          onClick={onPublish}
          className="flex-1 bg-[#E85C2B] hover:bg-[#d54e1f] text-white h-12"
        >
          Publish Now
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#1A1A1A]/5 h-12"
        >
          Schedule for Later
        </Button>
      </div>
    </div>
  );
}
