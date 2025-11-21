import { useNavigate } from "react-router-dom";
import type { Venue } from "../types/api";

interface VenuesTabProps {
  venues: Venue[];
}

export default function VenuesTab({ venues }: VenuesTabProps) {
  const navigate = useNavigate();

  if (!venues.length) {
    return <p className="text-gray-600">You don’t manage any venues yet.</p>;
  }

  return (
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
            <button
              type="button"
              onClick={() => navigate(`/venues/${venue.id}`)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View
            </button>
            <button
              type="button"
              onClick={() => navigate(`/venues/${venue.id}/edit`)}
              className="text-sm text-gray-700 hover:text-gray-900 font-medium"
            >
              Manage
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
