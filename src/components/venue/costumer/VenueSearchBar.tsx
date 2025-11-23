import { useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import Button from "../../ui/Button";
import "react-day-picker/dist/style.css";

interface SearchValues {
  query: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

interface VenueSearchBarProps {
  onSearch: (values: SearchValues) => void;
}

export default function VenueSearchBar({ onSearch }: VenueSearchBarProps) {
  const [query, setQuery] = useState("");
  const [guests, setGuests] = useState(1);

  const [range, setRange] = useState<DateRange | undefined>();
  const [openCalendar, setOpenCalendar] = useState(false);

  const checkIn = range?.from ? range.from.toISOString().slice(0, 10) : "";
  const checkOut = range?.to ? range.to.toISOString().slice(0, 10) : "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch({ query, checkIn, checkOut, guests });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-2xl p-4 mb-10 border border-gray-100 max-w-5xl mx-auto"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Destination */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
            Destination
          </label>
          <input
            type="text"
            placeholder="Where are you going?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Date Picker Trigger */}
        <div className="relative w-full md:w-64">
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
            Dates
          </label>

          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => setOpenCalendar(!openCalendar)}
            className="w-full text-left"
          >
            {checkIn && checkOut ? `${checkIn} → ${checkOut}` : "Select dates"}
          </Button>

          {openCalendar && (
            <div className="absolute z-40 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl p-3">
              <DayPicker
                mode="range"
                numberOfMonths={2}
                selected={range}
                onSelect={setRange}
              />
            </div>
          )}
        </div>

        {/* Travelers */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
            Travelers
          </label>
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value) || 1)}
            className="w-24 border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Search*/}
        <button
          type="submit"
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm md:text-base transition shadow-sm"
        >
          Search
        </button>
      </div>
    </form>
  );
}
