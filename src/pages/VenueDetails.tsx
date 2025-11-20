import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Venue } from "../types/api";
import { getVenueById } from "../api/venuesApi";
import SkeletonVenueDetails from "../components/SkeletonVenueDetails";

export default function VenueDetails() {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) {
        setError("No venue ID provided.");
        setLoading(false);
        return;
      }

      try {
        const data = await getVenueById(id);
        setVenue(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load venue details."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return <SkeletonVenueDetails />;
  }

  if (error || !venue) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">
          {error ?? "Venue not found or unavailable."}
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <img
            src={venue.media?.[0]?.url || "https://placehold.co/1200x600"}
            alt={venue.media?.[0]?.alt || venue.name}
            className="w-full h-72 md:h-96 object-cover"
          />
        </div>

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

        {venue.owner && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">Hosted by</h2>
            <p className="text-gray-700">
              {venue.owner.name} ({venue.owner.email})
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-3">Book this venue</h2>
          <p className="text-gray-500 text-sm mb-3">Booking function</p>
          <button
            type="button"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition"
          >
            Book now (soon)
          </button>
        </div>
      </div>
    </section>
  );
}
