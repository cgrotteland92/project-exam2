import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Venue } from "../../types/api";
import Button from "../ui/Button";
import EditVenueModal from "./manager/EditVenueModal";

interface VenuesTabProps {
  venues: Venue[];
  onVenueUpdated?: (venue: Venue) => void;
}

export default function VenuesTab({ venues, onVenueUpdated }: VenuesTabProps) {
  const navigate = useNavigate();
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  if (!venues.length) {
    return <p className="text-gray-600">No venues found.</p>;
  }

  function handleUpdated(updated: Venue) {
    if (onVenueUpdated) {
      onVenueUpdated(updated);
    }
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
          >
            <img
              src={venue.media?.[0]?.url || "https://placehold.co/600x400"}
              alt={venue.media?.[0]?.alt || venue.name}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold mb-1">{venue.name}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {venue.location?.city || "Unknown location"}
            </p>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {venue.description || "No description available."}
            </p>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/venues/${venue.id}`)}
              >
                View
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditingVenue(venue)}
              >
                Manage
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingVenue && (
        <EditVenueModal
          venue={editingVenue}
          isOpen={!!editingVenue}
          onClose={() => setEditingVenue(null)}
          onUpdated={handleUpdated}
        />
      )}
    </>
  );
}
