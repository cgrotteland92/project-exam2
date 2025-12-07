import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

import { getVenues, searchVenues } from "../api/venuesApi";
import type { Venue } from "../types/api";

import VenueSearchBar from "../components/venue/costumer/VenueSearchBar";
import { Icons } from "../components/venue/details/VenueIcons";
import Button from "../components/ui/Button";

function normalizeRegion(region: string | undefined | null) {
  if (!region) return "Unknown";
  const clean = region.trim().toLowerCase();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export default function AllVenues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [displayedVenues, setDisplayedVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  useEffect(() => {
    async function fetchInitialVenues() {
      try {
        const data = await getVenues();
        const shuffled = data.sort(() => 0.5 - Math.random());
        setVenues(shuffled);
        setDisplayedVenues(shuffled);
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInitialVenues();
  }, []);

  const regions = useMemo(() => {
    const rawContinents = venues.map((v) => v.location?.continent);
    const cleanContinents = rawContinents
      .filter(
        (c): c is string =>
          typeof c === "string" && c.trim() !== "" && c !== "null"
      )
      .map((c) => normalizeRegion(c));

    return ["All", ...new Set(cleanContinents)].sort();
  }, [venues]);

  function handleRegionFilter(region: string) {
    setSelectedRegion(region);
    setVisibleCount(12);

    if (region === "All") {
      setDisplayedVenues(venues);
    } else {
      const filtered = venues.filter(
        (v) => normalizeRegion(v.location?.continent) === region
      );
      setDisplayedVenues(filtered);
    }
  }

  async function handleSearch({
    query,
    guests,
  }: {
    query: string;
    guests: number;
  }) {
    setLoading(true);
    setVisibleCount(12);
    setSelectedRegion("All");

    try {
      const q = query.trim();
      let results: Venue[] = [];

      if (q) {
        results = await searchVenues(q);
      } else {
        results = venues;
      }

      if (guests > 1) {
        results = results.filter((venue) => venue.maxGuests >= guests);
      }

      setDisplayedVenues(results);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  }

  const currentVenues = displayedVenues.slice(0, visibleCount);
  const hasMore = visibleCount < displayedVenues.length;

  return (
    <section className="min-h-screen bg-stone-50 pb-20">
      {/* Header*/}
      <div className="pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-brand font-bold text-stone-900 mb-8 tracking-tight">
            Explore All Available Venues
          </h1>
          <div className="max-w-3xl mx-auto">
            <VenueSearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-4">
        {/* Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-stone-900">
            {selectedRegion === "All"
              ? "All Venues"
              : `Stays in ${selectedRegion}`}
          </h2>

          {regions.length > 1 && (
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-stone-200">
              <span className="text-sm font-medium text-stone-500 pl-2">
                Region:
              </span>
              <select
                value={selectedRegion}
                onChange={(e) => handleRegionFilter(e.target.value)}
                className="bg-transparent border-none text-stone-900 text-sm font-semibold focus:ring-0 cursor-pointer pr-8 focus:outline-none"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  className="bg-stone-200 rounded-2xl shadow-md h-[400px] animate-pulse"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              ))
            ) : currentVenues.length > 0 ? (
              currentVenues.map((venue, index) => (
                <motion.div
                  key={venue.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link
                    to={`/venues/${venue.id}`}
                    className="group bg-white shadow-sm hover:shadow-xl rounded-2xl overflow-hidden border border-stone-100 flex flex-col h-full transition-all duration-300"
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden h-64 bg-stone-100">
                      <img
                        src={
                          venue.media?.[0]?.url ||
                          "https://placehold.co/600x400?text=No+Image"
                        }
                        alt={venue.media?.[0]?.alt || venue.name}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/600x400?text=Image+Error";
                        }}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                        Max {venue.maxGuests} Guests
                      </span>
                    </div>

                    <div className="p-5 flex flex-col grow">
                      <div className="mb-1 flex justify-between items-start gap-2">
                        <h2 className="text-lg font-bold text-stone-900 truncate flex-1 group-hover:text-teal-600 transition-colors">
                          {venue.name}
                        </h2>

                        {venue.rating !== undefined && venue.rating > 0 && (
                          <span className="flex items-center gap-1 text-xs font-bold bg-stone-100 text-stone-800 px-2 py-1 rounded-full shrink-0">
                            <Icons.Star className="text-teal-600" />
                            {venue.rating}
                          </span>
                        )}
                      </div>

                      <div className="text-stone-500 text-sm mb-4 flex items-center gap-1.5">
                        <Icons.MapPin />
                        <span className="truncate">
                          {venue.location?.city || "Unknown City"},{" "}
                          {venue.location?.country || "Country"}
                        </span>
                      </div>

                      <div className="mt-auto pt-3 border-t border-stone-100">
                        <span className="text-lg font-bold text-stone-900">
                          {venue.price} NOK
                        </span>
                        <span className="text-sm font-normal text-stone-500">
                          {" "}
                          / night
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <h3 className="text-xl font-semibold text-stone-800">
                  No venues found
                </h3>
                <p className="text-stone-500 mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Load More */}
        {!loading && hasMore && (
          <div className="mt-12 text-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="min-w-[200px] shadow-sm"
            >
              Load More Venues
            </Button>
            <p className="text-sm text-stone-400 mt-2">
              Showing {visibleCount} of {displayedVenues.length}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
