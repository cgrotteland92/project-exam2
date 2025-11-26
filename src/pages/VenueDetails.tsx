import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";

import type { Venue, Booking } from "../types/api";
import { getVenueById, getVenues } from "../api/venuesApi";

import SkeletonVenueDetails from "../components/venue/SkeletonVenueDetails";
import VenueBookingModal from "../components/venue/costumer/VenueBookingModal";

import VenueGallery from "../components/venue/details/VenueGallery";
import VenueBookingCard from "../components/venue/details/VenueBookingCard";
import VenueFacilities from "../components/venue/details/VenueFacilities";
import VenueHost from "../components/venue/details/VenueHost";
import { Icons } from "../components/venue/details/VenueIcons";

export default function VenueDetails() {
  const { id } = useParams<{ id: string }>();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [otherVenues, setOtherVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    async function load() {
      if (!id) return;

      setLoading(true);
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

  // Load Similar Venues
  useEffect(() => {
    async function loadOthers() {
      try {
        const all = await getVenues();

        const filtered = all
          .filter((v) => v.id !== id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        setOtherVenues(filtered);
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

  if (loading) return <SkeletonVenueDetails />;

  if (error || !venue) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error ?? "Venue not found."}</p>
          <Link to="/" className="text-blue-600 hover:underline">
            Return Home
          </Link>
        </div>
      </section>
    );
  }

  const {
    name,
    description,
    location,
    price,
    maxGuests,
    rating,
    meta,
    owner,
    media,
  } = venue;

  return (
    <section className="min-h-screen bg-white pb-12">
      <VenueGallery key={id} media={media} name={name} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 pb-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Icons.MapPin />
                  {location?.city}, {location?.country}
                </span>
                {typeof rating === "number" && (
                  <>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="flex items-center gap-1 font-medium text-gray-900">
                      <Icons.Star />
                      {rating.toFixed(1)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {owner && (
              <div className="hidden md:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                {owner.avatar?.url ? (
                  <img
                    src={owner.avatar.url}
                    alt={owner.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                    <Icons.User />
                  </div>
                )}
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    Hosted by {owner.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-10">
            <VenueFacilities meta={meta} />

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About this venue
              </h3>
              <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                {description || "No description provided by the host."}
              </div>
            </section>

            <VenueHost owner={owner} />
          </div>

          <VenueBookingCard
            price={price}
            maxGuests={maxGuests}
            onBookClick={() => setShowBookingModal(true)}
          />
        </div>

        {otherVenues.length > 0 && (
          <div className="mt-24 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherVenues.map((v) => (
                <Link key={v.id} to={`/venues/${v.id}`} className="group block">
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-100 mb-3">
                    <img
                      src={v.media?.[0]?.url || "https://placehold.co/600x400"}
                      alt={v.media?.[0]?.alt || v.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {v.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-medium">
                        <Icons.Star />
                        {v.rating}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {v.location?.city || "Unknown location"}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {v.price} NOK{" "}
                      <span className="font-normal text-gray-500">/ night</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

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
