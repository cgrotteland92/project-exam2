import { useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import type { Booking } from "../../types/api";
import "react-day-picker/dist/style.css";

interface VenueBookingCalendarProps {
  bookings: Booking[] | undefined;
  onChange: (values: { checkIn: string; checkOut: string }) => void;
}

export default function VenueBookingCalendar({
  bookings,
  onChange,
}: VenueBookingCalendarProps) {
  const [range, setRange] = useState<DateRange | undefined>();
  const today = new Date();

  const bookedRanges: DateRange[] =
    bookings?.map((booking) => ({
      from: new Date(booking.dateFrom),
      to: new Date(booking.dateTo),
    })) ?? [];

  function handleSelect(selected: DateRange | undefined) {
    setRange(selected);

    const checkIn = selected?.from?.toISOString().slice(0, 10) ?? "";
    const checkOut = selected?.to?.toISOString().slice(0, 10) ?? "";

    onChange({ checkIn, checkOut });
  }

  return (
    <div>
      <DayPicker
        mode="range"
        numberOfMonths={2}
        selected={range}
        onSelect={handleSelect}
        fromMonth={today}
        disabled={[{ before: today }, ...bookedRanges]}
        pagedNavigation
        modifiersClassNames={{
          selected: "bg-blue-600 text-white",
          range_start: "bg-blue-600 text-white rounded-l-full",
          range_end: "bg-blue-600 text-white rounded-r-full",
          range_middle: "bg-blue-100 text-blue-700",
          disabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
        }}
      />

      {bookings && bookings.length > 0 && (
        <p className="mt-2 text-xs text-gray-500">
          Greyed-out dates are already booked.
        </p>
      )}
    </div>
  );
}
