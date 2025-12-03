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
    setOpenCalendar(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl shadow-stone-200/50 rounded-2xl p-4 mb-10 border border-stone-100 max-w-5xl mx-auto relative z-20"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Destination */}
        <div className="flex-1">
          <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">
            Destination
          </label>
          <input
            type="text"
            placeholder="Where are you going?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-stone-900 placeholder-stone-400 transition-all"
          />
        </div>

        {/* Date Picker Trigger */}
        <div className="relative w-full md:w-64">
          <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">
            Dates
          </label>

          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => setOpenCalendar(!openCalendar)}
            className="w-full justify-start font-normal text-stone-600 py-3 border-stone-200 hover:border-stone-300"
          >
            {checkIn && checkOut ? (
              <span className="text-stone-900 font-medium">
                {new Date(checkIn).toLocaleDateString()} &rarr;{" "}
                {new Date(checkOut).toLocaleDateString()}
              </span>
            ) : (
              "Select dates"
            )}
          </Button>

          {openCalendar && (
            <div className="absolute z-50 mt-3 bg-white border border-stone-100 shadow-2xl rounded-2xl p-4 left-0 md:left-auto md:right-0">
              <DayPicker
                mode="range"
                numberOfMonths={2}
                selected={range}
                onSelect={setRange}
                modifiersClassNames={{
                  selected:
                    "bg-teal-600 text-white rounded-full hover:bg-teal-700",
                  today: "text-teal-600 font-bold",
                }}
              />
            </div>
          )}
        </div>

        {/* Travelers */}
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">
            Travelers
          </label>
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value) || 1)}
            className="w-full md:w-28 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-stone-900 transition-all"
          />
        </div>

        {/* Search Button */}
        <div className="w-full md:w-auto">
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full md:w-auto py-3 px-8 shadow-lg shadow-teal-900/20"
          >
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}
