import type { Booking } from "../../../types/api";
import Button from "../../ui/Button";

interface BookingsTabProps {
  bookings?: Booking[];
  onCancelBooking: (id: string) => void;
}

export default function BookingsTab({
  bookings,
  onCancelBooking,
}: BookingsTabProps) {
  if (!bookings || bookings.length === 0) {
    return <p className="text-gray-600">You have no bookings yet.</p>;
  }

  const now = new Date();

  const upcoming = bookings.filter(
    (b) => new Date(b.dateTo).getTime() >= now.getTime()
  );
  const past = bookings.filter(
    (b) => new Date(b.dateTo).getTime() < now.getTime()
  );

  function section(
    title: string,
    items: Booking[],
    showCancel: boolean = false
  ) {
    if (!items.length) return null;

    return (
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
            >
              <img
                src={
                  booking.venue?.media?.[0]?.url ||
                  "https://placehold.co/600x400"
                }
                alt={
                  booking.venue?.media?.[0]?.alt ||
                  booking.venue?.name ||
                  "Venue"
                }
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="text-base font-semibold mb-1">
                {booking.venue?.name ?? "Unknown venue"}
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(booking.dateFrom).toLocaleDateString()} →{" "}
                {new Date(booking.dateTo).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                Guests: {booking.guests}
              </p>

              {showCancel && (
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={() => onCancelBooking(booking.id)}
                >
                  Cancel booking
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div>
      {section("Upcoming trips", upcoming, true)}
      {section("Past bookings", past, false)}
    </div>
  );
}
