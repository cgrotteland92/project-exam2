import { Link } from "react-router-dom";
import type { Booking } from "../../../types/api";
import Button from "../../ui/Button";

interface BookingsTabProps {
  bookings?: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

export default function BookingsTab({
  bookings,
  onCancelBooking,
}: BookingsTabProps) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
        <p className="text-stone-500 mb-3 font-medium">
          You have no upcoming bookings.
        </p>
        <Link
          to="/"
          className="text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline inline-block transition-colors"
        >
          Explore venues
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => {
        const start = new Date(booking.dateFrom).toLocaleDateString();
        const end = new Date(booking.dateTo).toLocaleDateString();

        return (
          <div
            key={booking.id}
            className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-6"
          >
            <Link
              to={`/venues/${booking.venue?.id}`}
              className="shrink-0 group block"
            >
              <div className="w-full sm:w-40 h-32 rounded-xl overflow-hidden bg-stone-100 relative">
                <img
                  src={
                    booking.venue?.media?.[0]?.url ||
                    "https://placehold.co/200x200"
                  }
                  alt={booking.venue?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-4">
                  <Link to={`/venues/${booking.venue?.id}`}>
                    <h3 className="font-bold text-lg text-stone-900 hover:text-teal-600 transition-colors line-clamp-1">
                      {booking.venue?.name || "Unknown Venue"}
                    </h3>
                  </Link>
                  <span className="text-xs font-bold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full border border-teal-100 shrink-0">
                    Confirmed
                  </span>
                </div>

                <div className="mt-2 text-sm text-stone-600 space-y-1">
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-stone-900">Dates:</span>{" "}
                    {start} - {end}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-stone-900">Guests:</span>{" "}
                    {booking.guests}
                  </p>
                </div>
              </div>

              <div className="mt-5 sm:mt-0 flex justify-end pt-4 sm:pt-0 border-t sm:border-0 border-stone-100">
                <Button
                  variant="danger"
                  size="sm"
                  className="text-red-600 bg-red-50 hover:bg-red-100 border-red-100"
                  onClick={() => onCancelBooking(booking.id)}
                >
                  Cancel booking
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
