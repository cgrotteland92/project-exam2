import { useState } from "react";
import DateRangePicker from "./DateRangePicker";

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
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

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

        <div className="w-full md:w-64">
          <DateRangePicker
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={({ checkIn, checkOut }) => {
              setCheckIn(checkIn);
              setCheckOut(checkOut);
            }}
          />
        </div>

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

        <div className="md:self-stretch flex items-end">
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm md:text-base transition shadow-sm"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
