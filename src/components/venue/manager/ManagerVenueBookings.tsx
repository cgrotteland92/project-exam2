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
      <p className="text-gray-600 text-sm">No bookings for your venues yet.</p>
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
      <section className="mb-8">
        <h3 className="text-md font-semibold mb-3">{title}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {items.map(({ booking, venue }) => (
              <motion.button
                key={booking.id}
                type="button"
                onClick={() => handleCardClick(venue.id)}
                className={`text-left bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  highlight ? "ring-1 ring-blue-50" : ""
                }`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                <img
                  src={venue.media?.[0]?.url || "https://placehold.co/600x400"}
                  alt={venue.media?.[0]?.alt || venue.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />

                <h4 className="text-base font-semibold mb-1">{venue.name}</h4>

                <p className="text-xs text-gray-500 mb-1">
                  Booked by{" "}
                  <span className="font-medium">
                    {booking.customer?.name ?? "Customer"}
                  </span>
                </p>

                <p className="text-sm text-gray-600">
                  {new Date(booking.dateFrom).toLocaleDateString()} →{" "}
                  {new Date(booking.dateTo).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Guests: {booking.guests}
                </p>
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
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-500">
          {allBookings.length} booking
          {allBookings.length === 1 ? "" : "s"} across your venues
        </p>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">Sort by</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="soonest">Soonest first</option>
            <option value="latest">Latest first</option>
          </select>
        </div>
      </div>

      {section("Upcoming bookings for your venues", upcoming, true)}
      {section("Past bookings for your venues", past, false)}
    </div>
  );
}
