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
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-3">Book this venue</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* CALENDAR */}
        <div>
          <DayPicker
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={handleSelect}
            disabled={[{ before: today }, ...bookedRanges]}
            pagedNavigation
            modifiersClassNames={{
              selected: "bg-blue-600 text-white",
              range_start: "bg-blue-600 text-white rounded-l-full",
              range_end: "bg-blue-600 text-white rounded-r-full",
              range_middle: "bg-blue-100 text-blue-700",
              disabled:
                "bg-gray-100 text-gray-400 line-through cursor-not-allowed",
            }}
          />
          {bookings.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Greyed-out dates are unavailable.
            </p>
          )}
        </div>

        {/* BOOKING FORM */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guests
            </label>
            <input
              type="number"
              min={1}
              max={venue.maxGuests}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value) || 1)}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2"
            />
            <p className="text-xs text-gray-500">
              Max {venue.maxGuests} guests.
            </p>
          </div>

          <div className="text-sm text-gray-700">
            <p>
              <span className="font-medium">Check-in:</span> {checkIn || "—"}
            </p>
            <p>
              <span className="font-medium">Check-out:</span> {checkOut || "—"}
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={!checkIn || !checkOut}
            onClick={handleBookNow}
          >
            Book now
          </Button>
        </div>
      </div>
    </div>
  );
}
