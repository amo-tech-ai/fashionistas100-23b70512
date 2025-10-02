import { Button } from "@/components/ui/button";
import { Edit2, Check } from "lucide-react";

interface ReviewPublishProps {
  data: any;
  onPublish: () => void;
}

export function ReviewPublish({ data, onPublish }: ReviewPublishProps) {
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
            <p className="text-sm text-[#1A1A1A]">{data.event?.title || "Not set"}</p>
          </div>
          <div>
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Type</p>
            <p className="text-sm text-[#1A1A1A]">{data.event?.type || "Not set"}</p>
          </div>
          <div>
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Date & Time</p>
            <p className="text-sm text-[#1A1A1A]">
              {data.event?.date || "Not set"} at {data.event?.startTime || "Not set"} - {data.event?.endTime || "Not set"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Description</p>
            <p className="text-sm text-[#1A1A1A] line-clamp-3">
              {data.event?.description || "Not set"}
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
            <p className="text-sm text-[#1A1A1A] capitalize">{data.venue?.mode || "Not set"}</p>
          </div>
          {(data.venue?.mode === "physical" || data.venue?.mode === "hybrid") && (
            <>
              <div>
                <p className="text-xs text-[#1A1A1A]/60 mb-1">Venue Name</p>
                <p className="text-sm text-[#1A1A1A]">{data.venue?.venueName || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-[#1A1A1A]/60 mb-1">Address</p>
                <p className="text-sm text-[#1A1A1A]">{data.venue?.address || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-[#1A1A1A]/60 mb-1">Capacity</p>
                <p className="text-sm text-[#1A1A1A]">{data.venue?.capacity || 0} people</p>
              </div>
            </>
          )}
          {(data.venue?.mode === "virtual" || data.venue?.mode === "hybrid") && (
            <>
              <div>
                <p className="text-xs text-[#1A1A1A]/60 mb-1">Platform</p>
                <p className="text-sm text-[#1A1A1A]">{data.venue?.platform || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-[#1A1A1A]/60 mb-1">Stream URL</p>
                <p className="text-sm text-[#1A1A1A] truncate">{data.venue?.streamUrl || "Not set"}</p>
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
        {data.tickets?.tiers && data.tickets.tiers.length > 0 ? (
          <div className="space-y-3">
            {data.tickets.tiers.map((tier: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">{tier.name}</p>
                  <p className="text-xs text-[#1A1A1A]/60">{tier.quantity} tickets available</p>
                </div>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  ${tier.price === "0" ? "Free" : `${tier.price} COP`}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#1A1A1A]/60">No tickets configured</p>
        )}
      </div>

      {/* Sponsors */}
      {data.sponsors?.sponsors && data.sponsors.sponsors.length > 0 && (
        <div className="p-6 bg-[#FAF8F5] rounded-lg">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-medium text-[#1A1A1A]">Sponsors</h3>
            <Button variant="ghost" size="sm" className="text-[#E85C2B] hover:bg-[#E85C2B]/10">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="space-y-2">
            {data.sponsors.sponsors.map((sponsor: any, index: number) => (
              <div key={index} className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-[#E85C2B]" />
                <p className="text-sm text-[#1A1A1A]">{sponsor.name}</p>
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
