import { useState } from "react";
import { Link } from "react-router-dom";
import type { Venue } from "../../types/api";
import Button from "../ui/Button";
import EditVenueModal from "./manager/EditVenueModal";

interface VenuesTabProps {
  venues: Venue[];
  onVenueUpdated: (venue: Venue) => void;
  onVenueDeleted: (venueId: string) => void;
}

export default function VenuesTab({
  venues,
  onVenueUpdated,
  onVenueDeleted,
}: VenuesTabProps) {
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  if (!venues.length) {
    return (
      <div className="text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-300">
        <p className="text-stone-600">You haven't created any venues yet.</p>
      </div>
    );
  }

  function handleUpdated(updated: Venue) {
    onVenueUpdated(updated);
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col h-full overflow-hidden group hover:shadow-md transition-shadow duration-300"
          >
            <Link
              to={`/venues/${venue.id}`}
              className="block grow cursor-pointer"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={venue.media?.[0]?.url || "https://placehold.co/600x400"}
                  alt={venue.media?.[0]?.alt || venue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                  {venue.price} NOK
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg text-stone-900 mb-1 truncate group-hover:text-teal-600 transition-colors">
                  {venue.name}
                </h3>
                <p className="text-sm text-stone-500 mb-3">
                  {venue.location?.city || "Unknown location"}
                </p>
                <p className="text-sm text-stone-600 line-clamp-2">
                  {venue.description || "No description available."}
                </p>
              </div>
            </Link>

            <div className="px-5 pb-5 pt-2 flex gap-3 mt-auto border-t border-stone-100">
              <Link
                to={`/venues/${venue.id}`}
                className="flex-1 text-center py-2 rounded-lg text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                View
              </Link>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => setEditingVenue(venue)}
              >
                Manage
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingVenue && (
        <EditVenueModal
          venue={editingVenue}
          isOpen={!!editingVenue}
          onClose={() => setEditingVenue(null)}
          onUpdated={handleUpdated}
          onDeleted={onVenueDeleted}
        />
      )}
    </>
  );
}
