import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getVenues } from "../api/venuesApi";
import type { Venue } from "../types/api.d.ts";

/**
 * Home page showing a list of venues.
 * @component
 */
export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const data = await getVenues();
        setVenues(data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800 tracking-tight">
          Explore Unique Venues
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {loading
              ? [...Array(6)].map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    className="bg-gray-200 rounded-2xl shadow-md h-80 animate-pulse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                ))
              : venues.map((venue) => (
                  <motion.div
                    key={venue.id}
                    className="group bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          venue.media?.[0]?.url ||
                          "https://placehold.co/600x400"
                        }
                        alt={venue.media?.[0]?.alt || venue.name}
                        className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <span className="absolute top-3 right-3 bg-white/80 text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                        {venue.maxGuests} Guests
                      </span>
                    </div>

                    <div className="p-5 flex flex-col justify-between h-[200px]">
                      <div>
                        <h2 className="text-lg font-semibold mb-1 text-gray-800 truncate">
                          {venue.name}
                        </h2>
                        <p className="text-gray-500 text-sm mb-2">
                          {venue.location?.city || "Unknown location"}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {venue.description || "No description provided."}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <p className="text-lg font-bold text-blue-600">
                          {venue.price} NOK / night
                        </p>
                        <Link
                          to={`/venues/${venue.id}`}
                          className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
