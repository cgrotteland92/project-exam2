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
      <section className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <p className="text-stone-600 mb-4">{error ?? "Venue not found."}</p>
          <Link to="/" className="text-teal-600 hover:underline font-semibold">
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
    <section className="min-h-screen bg-stone-50 pb-20">
      <VenueGallery key={id} media={media} name={name} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-stone-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-stone-900 mb-4 tracking-tight">
                {name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-stone-500">
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm">
                  <Icons.MapPin className="text-teal-600" />
                  {location?.city}, {location?.country}
                </span>
                {typeof rating === "number" && (
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm">
                    <Icons.Star className="text-teal-600" />
                    <span className="text-stone-900 font-bold">
                      {rating.toFixed(1)}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {owner && (
              <div className="hidden md:flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-stone-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                {owner.avatar?.url ? (
                  <img
                    src={owner.avatar.url}
                    alt={owner.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-stone-100"
                  />
                ) : (
                  <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                    <Icons.User />
                  </div>
                )}
                <div className="text-sm">
                  <p className="text-stone-400 text-xs uppercase tracking-wide font-bold">
                    Hosted by
                  </p>
                  <p className="font-bold text-stone-900">{owner.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            <VenueFacilities meta={meta} />

            <section>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">
                About this place
              </h3>
              <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed whitespace-pre-line text-lg">
                {description || "No description provided by the host."}
              </div>
            </section>

            <VenueHost owner={owner} />
          </div>

          {/* Sticky Booking Card */}
          <div className="relative">
            <VenueBookingCard
              price={price}
              maxGuests={maxGuests}
              onBookClick={() => setShowBookingModal(true)}
            />
          </div>
        </div>

        {/* Similar Venues */}
        {otherVenues.length > 0 && (
          <div className="mt-24 pt-12 border-t border-stone-200">
            <h2 className="text-3xl font-bold text-stone-900 mb-8">
              More places to stay
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherVenues.map((v) => (
                <Link
                  key={v.id}
                  to={`/venues/${v.id}`}
                  className="group block h-full"
                >
                  <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                      <img
                        src={
                          v.media?.[0]?.url || "https://placehold.co/600x400"
                        }
                        alt={v.media?.[0]?.alt || v.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {v.price} NOK
                      </div>
                    </div>
                    <div className="p-5 flex flex-col grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-stone-900 line-clamp-1 group-hover:text-teal-600 transition-colors">
                          {v.name}
                        </h3>
                        {v.rating !== undefined && v.rating > 0 && (
                          <span className="flex items-center gap-1 text-xs font-bold bg-stone-100 text-stone-900 px-2 py-1 rounded-full shrink-0">
                            <Icons.Star className="text-teal-600" /> {v.rating}
                          </span>
                        )}
                      </div>
                      <p className="text-stone-500 text-sm flex items-center gap-1.5 mb-4">
                        <Icons.MapPin className="w-4 h-4" />
                        {v.location?.city || "Unknown location"}
                      </p>
                      <div className="mt-auto pt-4 border-t border-stone-100 flex justify-between items-center">
                        <span className="text-sm font-medium text-stone-500">
                          Max {v.maxGuests} guests
                        </span>
                        <span className="text-sm font-bold text-teal-600 group-hover:underline">
                          View Details
                        </span>
                      </div>
                    </div>
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
