import type { Venue } from "../../types/api";

interface VenueHeaderProps {
  venue: Venue;
}

export default function VenueHeader({ venue }: VenueHeaderProps) {
  return (
    <>
      {/* IMAGE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        <img
          src={venue.media?.[0]?.url || "https://placehold.co/1200x600"}
          alt={venue.media?.[0]?.alt || venue.name}
          className="w-full h-72 md:h-96 object-cover"
        />
      </div>

      {/* VENUE HEADER */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {venue.name}
            </h1>
            <p className="text-gray-600">
              {venue.location?.address && `${venue.location.address}, `}
              {venue.location?.city && `${venue.location.city}, `}
              {venue.location?.country ?? ""}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {venue.price} NOK
            </p>
            <p className="text-sm text-gray-500">
              per night · {venue.maxGuests} guests
            </p>
          </div>
        </div>

        {venue.description && (
          <p className="mt-4 text-gray-700 leading-relaxed">
            {venue.description}
          </p>
        )}
      </div>
    </>
  );
}
