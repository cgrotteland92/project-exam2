import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";

import type { Venue, Booking } from "../types/api";
import { getVenueById, getVenues } from "../api/venuesApi";
import SkeletonVenueDetails from "../components/SkeletonVenueDetails";
import Button from "../components/ui/Button";
import VenueBookingModal from "../components/venue/VenueBookingModal";

export default function VenueDetails() {
  const { id } = useParams<{ id: string }>();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [otherVenues, setOtherVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

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

  useEffect(() => {
    async function loadOthers() {
      try {
        const all = await getVenues();
        const filtered = all.filter((v) => v.id !== id);
        setOtherVenues(filtered.slice(0, 3));
      } catch (err) {
        console.error("Failed to load other venues", err);
      }
    }

    if (id) loadOthers();
  }, [id]);

  const bookedRanges = useMemo(
    () =>
      venue?.bookings?.map((b: Booking) => ({
        from: new Date(b.dateFrom),
        to: new Date(b.dateTo),
      })) ?? [],
    [venue]
  );

  function handleBookingCreated(booking: Booking) {
    setVenue((prev) =>
      prev
        ? {
            ...prev,
            bookings: [...(prev.bookings ?? []), booking],
          }
        : prev
    );
  }

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

  const {
    name,
    description,
    media,
    location,
    price,
    maxGuests,
    rating,
    meta,
    created,
    updated,
    owner,
  } = venue;

  const createdDate = created ? new Date(created) : null;
  const updatedDate = updated ? new Date(updated) : null;

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* IMAGE */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <img
            src={media?.[0]?.url || "https://placehold.co/1200x600"}
            alt={media?.[0]?.alt || name}
            className="w-full h-72 md:h-96 object-cover"
          />
        </div>

        {/* HEADER + DETAILS */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{name}</h1>

              <p className="text-gray-600">
                {location?.address && `${location.address}, `}
                {location?.city && `${location.city}, `}
                {location?.country ?? ""}
              </p>

              {(location?.zip || location?.continent) && (
                <p className="text-sm text-gray-500 mt-1">
                  {location.zip && <span>{location.zip}</span>}
                  {location.zip && location.continent && <span> · </span>}
                  {location.continent && <span>{location.continent}</span>}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-3">
                {typeof rating === "number" && (
                  <span className="inline-flex items-center text-sm font-medium text-yellow-700 bg-yellow-50 rounded-full px-3 py-1">
                    ⭐ {rating.toFixed(1)}
                  </span>
                )}

                {meta?.wifi && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                    Wi-Fi
                  </span>
                )}
                {meta?.parking && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                    Parking
                  </span>
                )}
                {meta?.breakfast && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                    Breakfast
                  </span>
                )}
                {meta?.pets && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                    Pets allowed
                  </span>
                )}
              </div>
            </div>

            <div className="text-right space-y-2">
              <div>
                <p className="text-2xl font-bold text-blue-600">{price} NOK</p>
                <p className="text-sm text-gray-500">
                  per night · {maxGuests} guests
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setShowBookingModal(true)}
              >
                Book now
              </Button>
            </div>
          </div>

          {description && (
            <p className="mt-2 text-gray-700 leading-relaxed">{description}</p>
          )}

          {(createdDate || updatedDate) && (
            <div className="mt-4 text-xs text-gray-500 flex flex-wrap gap-3">
              {createdDate && (
                <span>
                  Listed{" "}
                  {createdDate.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
              {updatedDate && (
                <span>
                  · Updated{" "}
                  {updatedDate.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          )}
        </div>

        {/* HOST */}
        {owner && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-2">Hosted by</h2>
            <p className="text-gray-700">
              {owner.name} ({owner.email})
            </p>
          </div>
        )}

        {/* MORE VENUES */}
        {otherVenues.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">More places to stay</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherVenues.map((v) => (
                <Link
                  key={v.id}
                  to={`/venues/${v.id}`}
                  className="block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={v.media?.[0]?.url || "https://placehold.co/600x400"}
                    alt={v.media?.[0]?.alt || v.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {v.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {v.location?.city || "Unknown location"}
                    </p>
                    <p className="text-sm font-medium text-blue-600 mt-1">
                      {v.price} NOK / night
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOOKING MODAL */}
      <VenueBookingModal
        venue={venue}
        bookedRanges={bookedRanges}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onBookingCreated={handleBookingCreated}
      />
    </section>
  );
}
