import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import type { Venue } from "../../types/api";
import { useAuth } from "../../hooks/useAuth";
import { deleteVenue } from "../../api/venuesApi";
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
  const navigate = useNavigate();
  const { token } = useAuth();

  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!venues.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-600">You haven't created any venues yet.</p>
      </div>
    );
  }

  function handleUpdated(updated: Venue) {
    if (onVenueUpdated) {
      onVenueUpdated(updated);
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this venue? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteVenue(id, token);

      toast.success("Venue deleted successfully");

      onVenueDeleted(id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete venue");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col h-full"
          >
            <div className="relative aspect-4/3 mb-4">
              <img
                src={venue.media?.[0]?.url || "https://placehold.co/600x400"}
                alt={venue.media?.[0]?.alt || venue.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <span className="absolute top-2 right-2 bg-white/90 text-xs font-bold px-2 py-1 rounded shadow-sm">
                {venue.price} NOK
              </span>
            </div>

            <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
              {venue.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {venue.location?.city || "Unknown location"}
            </p>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2 grow">
              {venue.description || "No description available."}
            </p>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 mt-auto">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => navigate(`/venues/${venue.id}`)}
              >
                View
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => setEditingVenue(venue)}
              >
                Edit
              </Button>

              {/* DELETE BUTTON */}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                isLoading={deletingId === venue.id}
                onClick={() => handleDelete(venue.id)}
                className="text-red-600 hover:bg-red-50 border-gray-200"
              >
                Delete
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
