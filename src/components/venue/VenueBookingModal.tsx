import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { toast } from "react-hot-toast";

import type { Venue, Booking } from "../../types/api";
import { useAuth } from "../../context/useAuth";
import { createBooking } from "../../api/bookingsApi";
import Button from "../ui/Button";

interface VenueBookingModalProps {
  venue: Venue;
  bookedRanges: { from: Date; to: Date }[];
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated: (booking: Booking) => void;
}

export default function VenueBookingModal({
  venue,
  bookedRanges,
  isOpen,
  onClose,
  onBookingCreated,
}: VenueBookingModalProps) {
  const { token, user } = useAuth();

  const [range, setRange] = useState<DateRange | undefined>();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const from = new Date(checkIn);
    const to = new Date(checkOut);
    const diffMs = to.getTime() - from.getTime();
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  }, [checkIn, checkOut]);

  const totalPrice = useMemo(() => {
    if (!venue || nights === 0) return 0;
    return nights * venue.price;
  }, [venue, nights]);

  function handleSelect(selected: DateRange | undefined) {
    setRange(selected);
    setCheckIn(selected?.from?.toISOString().slice(0, 10) ?? "");
    setCheckOut(selected?.to?.toISOString().slice(0, 10) ?? "");
  }

  async function handleBooking() {
    if (!user || !token) {
      toast.error("You need to be logged in to book.");
      return;
    }

    if (!checkIn || !checkOut || nights === 0) {
      toast.error("Please select valid check-in and check-out dates.");
      return;
    }

    if (guests < 1 || guests > venue.maxGuests) {
      toast.error(`Guests must be between 1 and ${venue.maxGuests}.`);
      return;
    }

    try {
      setBookingLoading(true);

      const dateFromIso = new Date(checkIn).toISOString();
      const dateToIso = new Date(checkOut).toISOString();

      const booking = await createBooking({
        venueId: venue.id,
        dateFrom: dateFromIso,
        dateTo: dateToIso,
        guests,
        token,
      });

      onBookingCreated(booking);

      setRange(undefined);
      setCheckIn("");
      setCheckOut("");
      setGuests(1);

      toast.success("Booking confirmed! You can view it in your profile.");
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create booking";
      toast.error(message);
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">
              Book <span className="text-blue-600">{venue.name}</span>
            </h2>
            <p className="text-xs text-gray-500">
              Select your dates and guests to confirm your stay.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* CALENDAR */}
          <div>
            <DayPicker
              mode="range"
              numberOfMonths={2}
              selected={range}
              onSelect={handleSelect}
              disabled={bookedRanges}
              modifiersClassNames={{
                selected: "bg-blue-600 text-white",
                range_start: "bg-blue-600 text-white rounded-l-full",
                range_end: "bg-blue-600 text-white rounded-r-full",
                range_middle: "bg-blue-100 text-blue-700",
                disabled:
                  "bg-gray-100 text-gray-400 line-through cursor-not-allowed",
              }}
            />
            {venue.bookings?.length ? (
              <p className="text-xs text-gray-500 mt-1">
                Greyed-out dates are unavailable.
              </p>
            ) : null}
          </div>

          {/* FORM + SUMMARY */}
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

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Check-in:</span> {checkIn || "—"}
              </p>
              <p>
                <span className="font-medium">Check-out:</span>{" "}
                {checkOut || "—"}
              </p>
              <p>
                <span className="font-medium">Nights:</span> {nights || "—"}
              </p>
            </div>

            {nights > 0 && (
              <div className="border-t border-gray-200 pt-3 text-sm">
                <p className="flex justify-between mb-1">
                  <span>
                    {venue.price} NOK × {nights} night
                    {nights > 1 ? "s" : ""}
                  </span>
                  <span>{totalPrice} NOK</span>
                </p>
                <p className="text-xs text-gray-500">
                  Taxes and fees may apply.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleBooking}
                isLoading={bookingLoading}
                disabled={!checkIn || !checkOut || nights === 0}
              >
                Confirm booking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
