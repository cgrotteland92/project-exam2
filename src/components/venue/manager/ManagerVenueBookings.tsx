import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Venue, Booking } from "../../../types/api";

interface ManagerVenueBookingsProps {
  venues: Venue[];
}

interface BookingWithVenue {
  booking: Booking;
  venue: Venue;
}

type SortOrder = "soonest" | "latest";

export default function ManagerVenueBookings({
  venues,
}: ManagerVenueBookingsProps) {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<SortOrder>("soonest");

  const allBookings: BookingWithVenue[] = useMemo(
    () =>
      venues.flatMap((venue) =>
        (venue.bookings ?? []).map((booking) => ({ booking, venue }))
      ),
    [venues]
  );

  const [upcoming, past] = useMemo(() => {
    const now = new Date();

    const upcomingList: BookingWithVenue[] = [];
    const pastList: BookingWithVenue[] = [];

    for (const item of allBookings) {
      const dateTo = new Date(item.booking.dateTo);
      if (dateTo.getTime() >= now.getTime()) {
        upcomingList.push(item);
      } else {
        pastList.push(item);
      }
    }

    const sortFn = (a: BookingWithVenue, b: BookingWithVenue) => {
      const da = new Date(a.booking.dateFrom).getTime();
      const db = new Date(b.booking.dateFrom).getTime();
      return sortOrder === "soonest" ? da - db : db - da;
    };

    upcomingList.sort(sortFn);
    pastList.sort(sortFn);

    return [upcomingList, pastList];
  }, [allBookings, sortOrder]);

  if (!allBookings.length) {
    return (
      <div className="text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-300">
        <p className="text-stone-600 text-sm">
          No bookings for your venues yet.
        </p>
      </div>
    );
  }

  function handleCardClick(venueId: string) {
    navigate(`/venues/${venueId}`);
  }

  function section(
    title: string,
    items: BookingWithVenue[],
    highlight: boolean = false
  ) {
    if (!items.length) return null;

    return (
      <section className="mb-10">
        <h3 className="text-lg font-bold text-stone-900 mb-4 px-1">{title}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {items.map(({ booking, venue }) => (
              <motion.button
                key={booking.id}
                type="button"
                onClick={() => handleCardClick(venue.id)}
                className={`text-left bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 hover:-translate-y-1 ${
                  highlight ? "ring-1 ring-teal-50 bg-teal-50/10" : ""
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="relative h-40 bg-stone-100">
                  <img
                    src={
                      venue.media?.[0]?.url || "https://placehold.co/600x400"
                    }
                    alt={venue.media?.[0]?.alt || venue.name}
                    className="w-full h-full object-cover"
                  />
                  {highlight && (
                    <span className="absolute top-2 right-2 bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                      Upcoming
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h4 className="text-base font-bold text-stone-900 mb-1 truncate">
                    {venue.name}
                  </h4>

                  <p className="text-xs text-stone-500 mb-3 flex items-center gap-1">
                    Booked by{" "}
                    <span className="font-semibold text-stone-700">
                      {booking.customer?.name ?? "Customer"}
                    </span>
                  </p>

                  <div className="bg-stone-50 rounded-lg p-2 mb-2 border border-stone-100">
                    <p className="text-xs font-semibold text-stone-700">
                      {new Date(booking.dateFrom).toLocaleDateString()} &rarr;{" "}
                      {new Date(booking.dateTo).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-xs text-stone-500 font-medium">
                    {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
                  </p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </section>
    );
  }

  return (
    <div>
      {/* Sort bar */}
      <div className="flex items-center justify-between mb-6 bg-stone-50 p-3 rounded-xl border border-stone-100">
        <p className="text-sm font-medium text-stone-600 pl-2">
          <span className="font-bold text-stone-900">{allBookings.length}</span>{" "}
          booking
          {allBookings.length === 1 ? "" : "s"} total
        </p>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-stone-500 hidden sm:inline">Sort by:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-sm text-stone-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-medium"
          >
            <option value="soonest">Soonest first</option>
            <option value="latest">Latest first</option>
          </select>
        </div>
      </div>

      {section("Upcoming bookings", upcoming, true)}
      {section("Past bookings", past, false)}
    </div>
  );
}
