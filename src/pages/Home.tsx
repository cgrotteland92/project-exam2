import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { getVenues } from "../api/venuesApi";
import type { Venue } from "../types/api";
import { Icons } from "../components/venue/details/VenueIcons";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

const VenueRow = ({
  title,
  subtitle,
  venues,
}: {
  title: string;
  subtitle: string;
  venues: Venue[];
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (venues.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -800 : 800;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">{title}</h2>
            <p className="text-stone-500">{subtitle}</p>
          </div>
          <Link
            to="/venues"
            className="text-teal-700 font-bold cursor-pointer hover:text-teal-800 hover:underline hidden sm:block transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white cursor-pointer shadow-lg border border-stone-100 rounded-full p-3 text-stone-600 hover:text-teal-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
            aria-label="Scroll left"
          >
            <Icons.ChevronLeft />
          </button>

          {/* Horizontal Scroll Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            {venues.map((venue) => (
              <Link
                key={venue.id}
                to={`/venues/${venue.id}`}
                className="min-w-[280px] md:min-w-[320px] snap-center group/card block"
              >
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-4 border border-stone-100 shadow-sm">
                  <img
                    src={venue.media?.[0]?.url || "https://placehold.co/400"}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm text-stone-800">
                    <Icons.Star className="text-teal-600" /> {venue.rating}
                  </div>
                </div>
                <h3 className="font-bold text-stone-900 truncate group-hover/card:text-teal-700 transition-colors">
                  {venue.name}
                </h3>
                <p className="text-stone-500 text-sm mt-1 flex items-center justify-between">
                  <span>{venue.location?.city || "Unknown City"}</span>
                  <span>
                    <span className="font-semibold text-stone-900">
                      {venue.price} NOK
                    </span>{" "}
                    / night
                  </span>
                </p>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg border border-stone-100 rounded-full p-3 cursor-pointer text-stone-600 hover:text-teal-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
            aria-label="Scroll right"
          >
            <Icons.ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const { user } = useAuth();
  const [topRated, setTopRated] = useState<Venue[]>([]);
  const [budgetFriendly, setBudgetFriendly] = useState<Venue[]>([]);
  const [largeGroups, setLargeGroups] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await getVenues();

        // Top Rated
        const best = data
          .filter(
            (v) => v.rating && v.rating >= 4 && v.media && v.media.length > 0
          )
          .sort(() => 0.5 - Math.random())
          .slice(0, 8);
        setTopRated(best);

        // Budget Friendly
        const budget = data
          .filter((v) => v.price < 1000 && v.media && v.media.length > 0)
          .sort(() => 0.5 - Math.random())
          .slice(0, 8);
        setBudgetFriendly(budget);

        // Large Groups
        const large = data
          .filter((v) => v.maxGuests >= 6 && v.media && v.media.length > 0)
          .sort(() => 0.5 - Math.random())
          .slice(0, 8);
        setLargeGroups(large);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
            alt="Lake landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/40" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-brand font-extrabold text-white tracking-tight leading-tight drop-shadow-xl"
          >
            Wake up somewhere <br />
            <span className="font-brand text-teal-200">extraordinary.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-stone-100 max-w-2xl mx-auto font-light"
          >
            Discover unique homes, cabins, and getaways around the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link to="/venues">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-4 text-lg bg-teal-600 hover:bg-teal-700 text-white shadow-2xl shadow-teal-900/50 border-0"
              >
                Browse Venues
              </Button>
            </Link>

            {!user && (
              <Link to="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto px-8 py-4 text-lg bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-md"
                >
                  Become a Host
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-sm">
              <Icons.MapPin />
            </div>
            <h3 className="text-xl font-bold text-stone-800">
              Unique Locations
            </h3>
            <p className="text-stone-600">
              From secluded cabins to city lofts, find stays you won't see
              anywhere else.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-stone-700 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-sm">
              <Icons.Star />
            </div>
            <h3 className="text-xl font-bold text-stone-800">
              Top Rated Hosts
            </h3>
            <p className="text-stone-600">
              Book with confidence. Our hosts are verified and reviewed by
              travelers like you.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-sm">
              <Icons.Wifi />
            </div>
            <h3 className="text-xl font-bold text-stone-800">
              Modern Amenities
            </h3>
            <p className="text-stone-600">
              Enjoy high-speed wifi, flexible check-ins, and all the comforts of
              home.
            </p>
          </div>
        </div>
      </section>

      {/* Venues */}
      {loading ? (
        <div className="py-24 max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-stone-100 h-64 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <VenueRow
            title="Fan Favorites"
            subtitle="Highly rated spots for your next trip."
            venues={topRated}
          />
          <VenueRow
            title="Budget Friendly"
            subtitle="Great stays under 1000 NOK."
            venues={budgetFriendly}
          />
          <VenueRow
            title="Perfect for Groups"
            subtitle="Spacious venues for 6 or more guests."
            venues={largeGroups}
          />
        </>
      )}

      {/* Bottom banner*/}
      <section className="py-12 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto bg-stone-900 rounded-3xl overflow-hidden relative flex items-center shadow-2xl">
          <div className="absolute right-0 top-0 w-1/2 h-full hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
              className="w-full h-full object-cover opacity-60"
              alt="Community"
            />
            <div className="absolute inset-0 bg-linear-to-r from-stone-900 via-stone-900/80 to-transparent" />
          </div>

          <div className="relative z-10 p-8 md:p-12 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              One account, endless possibilities.
            </h2>
            <p className="text-stone-300 text-lg mb-8 leading-relaxed">
              Whether you want to explore the world or host travelers from it,
              Holidaze is your gateway. Connect with people from all over the
              globe.
            </p>

            {user ? (
              <Link to="/venues">
                <Button
                  size="lg"
                  className="px-8 bg-teal-600 hover:bg-teal-700 text-white border-0"
                >
                  Explore Venues
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button
                  size="lg"
                  className="px-8 bg-teal-600 hover:bg-teal-700 text-white border-0"
                >
                  Create Free Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
