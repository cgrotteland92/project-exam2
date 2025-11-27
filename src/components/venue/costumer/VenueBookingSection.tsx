import { useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

import type { Venue, Booking } from "../../../types/api";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../../api/bookingsApi";
import toast from "react-hot-toast";
import Button from "../../ui/Button";

interface VenueBookingSectionProps {
  venue: Venue;
}

export default function VenueBookingSection({
  venue,
}: VenueBookingSectionProps) {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [range, setRange] = useState<DateRange | undefined>();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const [bookings, setBookings] = useState<Booking[]>(venue.bookings ?? []);

  const today = new Date();

  const bookedRanges: DateRange[] =
    bookings.map((b) => ({
      from: new Date(b.dateFrom),
      to: new Date(b.dateTo),
    })) ?? [];

  function handleSelect(selected: DateRange | undefined) {
    setRange(selected);
    setCheckIn(selected?.from?.toISOString().slice(0, 10) ?? "");
    setCheckOut(selected?.to?.toISOString().slice(0, 10) ?? "");
  }

  async function handleBookNow() {
    if (!user || !token) {
      toast.error("You need to be logged in to make a booking.");
      navigate("/login");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }

    if (guests < 1 || guests > venue.maxGuests) {
      toast.error(`Guests must be between 1 and ${venue.maxGuests}.`);
      return;
    }

    try {
      const dateFromIso = new Date(checkIn).toISOString();
      const dateToIso = new Date(checkOut).toISOString();

      const booking = await createBooking({
        dateFrom: dateFromIso,
        dateTo: dateToIso,
        guests,
        venueId: venue.id,
        token,
      });

      setBookings((prev) => [...prev, booking]);

      setRange(undefined);
      setCheckIn("");
      setCheckOut("");

      toast.success("Booking created! You can see it on your profile.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create booking";
      toast.error(message);
      console.error(err);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-stone-100">
      <h2 className="text-lg font-bold text-stone-900 mb-4">Book this venue</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Calendar */}
        <div>
          <DayPicker
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={handleSelect}
            disabled={[{ before: today }, ...bookedRanges]}
            pagedNavigation
            modifiersClassNames={{
              selected: "bg-teal-600 text-white hover:bg-teal-700",
              range_start: "bg-teal-600 text-white rounded-l-full",
              range_end: "bg-teal-600 text-white rounded-r-full",
              range_middle: "bg-teal-50 text-teal-900",
              disabled:
                "text-stone-300 line-through opacity-50 cursor-not-allowed",
              today: "text-teal-600 font-bold",
            }}
            className="border-0"
          />
          {bookings.length > 0 && (
            <p className="text-xs text-stone-400 mt-2 pl-4 italic">
              * Greyed-out dates are unavailable.
            </p>
          )}
        </div>

        {/* Booking form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Guests
            </label>
            <input
              type="number"
              min={1}
              max={venue.maxGuests}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value) || 1)}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-stone-900 transition-all"
            />
            <p className="text-xs text-stone-500 mt-2">
              Max {venue.maxGuests} guests allowed.
            </p>
          </div>

          <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500 font-medium">Check-in</span>
              <span className="text-stone-900 font-bold">{checkIn || "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500 font-medium">Check-out</span>
              <span className="text-stone-900 font-bold">
                {checkOut || "—"}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled={!checkIn || !checkOut}
            onClick={handleBookNow}
            className="w-full shadow-lg shadow-teal-900/20"
          >
            Book now
          </Button>
        </div>
      </div>
    </div>
  );
}
