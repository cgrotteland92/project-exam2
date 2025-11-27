import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { toast } from "react-hot-toast";

import type { Venue, Booking } from "../../../types/api";
import { useAuth } from "../../../hooks/useAuth";
import { createBooking } from "../../../api/bookingsApi";
import Button from "../../ui/Button";

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
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl border border-stone-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Book <span className="text-teal-600">{venue.name}</span>
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Select your dates and guests to confirm your stay.
            </p>
          </div>
          <Button type="button" size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Calendar */}
          <div>
            <DayPicker
              mode="range"
              numberOfMonths={2}
              selected={range}
              onSelect={handleSelect}
              disabled={bookedRanges}
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
            {venue.bookings?.length ? (
              <p className="text-xs text-stone-400 mt-2 pl-4 italic">
                * Greyed-out dates are unavailable.
              </p>
            ) : null}
          </div>

          {/* Form */}
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
                <span className="text-stone-900 font-bold">
                  {checkIn || "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500 font-medium">Check-out</span>
                <span className="text-stone-900 font-bold">
                  {checkOut || "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-stone-200 mt-2">
                <span className="text-stone-500 font-medium">Nights</span>
                <span className="text-stone-900 font-bold">{nights}</span>
              </div>
            </div>

            {nights > 0 && (
              <div className="border-t border-stone-100 pt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-stone-600">
                    {venue.price} NOK × {nights} night{nights > 1 ? "s" : ""}
                  </span>
                  <span className="text-lg font-bold text-stone-900">
                    {totalPrice} NOK
                  </span>
                </div>
                <p className="text-xs text-stone-400 text-right">
                  Includes taxes and fees
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleBooking}
                isLoading={bookingLoading}
                disabled={!checkIn || !checkOut || nights === 0}
                className="shadow-lg shadow-teal-900/20"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
