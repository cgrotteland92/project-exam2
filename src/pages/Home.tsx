import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

import { getVenues, searchVenues } from "../api/venuesApi";
import type { Venue } from "../types/api";

import VenueSearchBar from "../components/venue/costumer/VenueSearchBar";
import { Icons } from "../components/venue/details/VenueIcons";

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [displayedVenues, setDisplayedVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInitialVenues() {
      try {
        const data = await getVenues();
        setVenues(data);
        setDisplayedVenues(data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialVenues();
  }, []);

  async function handleSearch({
    query,
    guests,
  }: {
    query: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }) {
    setLoading(true);
    const q = query.trim();

    try {
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

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-900 tracking-tight">
          Explore Unique Venues
        </h1>

        <VenueSearchBar onSearch={handleSearch} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  className="bg-gray-200 rounded-2xl shadow-md h-[400px] animate-pulse"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              ))
            ) : displayedVenues.length > 0 ? (
              displayedVenues.map((venue) => (
                <motion.div
                  key={venue.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Link
                    to={`/venues/${venue.id}`}
                    className="group bg-white shadow-sm hover:shadow-md rounded-2xl overflow-hidden border border-gray-100 flex flex-col h-full transition-all duration-300"
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden h-64 bg-gray-100">
                      <img
                        src={
                          venue.media?.[0]?.url ||
                          "https://placehold.co/600x400?text=No+Image"
                        }
                        alt={venue.media?.[0]?.alt || venue.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                        Max {venue.maxGuests} Guests
                      </span>
                    </div>

                    <div className="p-5 flex flex-col grow">
                      <div className="mb-4">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h2 className="text-lg font-bold text-gray-900 truncate flex-1 group-hover:text-blue-600 transition-colors">
                            {venue.name}
                          </h2>

                          {venue.rating !== undefined && venue.rating > 0 && (
                            <span className="flex items-center gap-1 text-xs font-bold bg-gray-100 text-gray-900 px-2 py-1 rounded-full shrink-0">
                              <Icons.Star />
                              {venue.rating}
                            </span>
                          )}
                        </div>

                        <div className="text-gray-500 text-sm mb-3 flex items-center gap-1.5">
                          <Icons.MapPin />
                          <span className="truncate">
                            {venue.location?.city || "Unknown City"},{" "}
                            {venue.location?.country || "Country"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            {venue.price} NOK
                          </span>
                          <span className="text-sm font-normal text-gray-500">
                            {" "}
                            / night
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <h3 className="text-xl font-semibold text-gray-800">
                  No venues found
                </h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
