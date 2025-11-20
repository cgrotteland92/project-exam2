import { useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DateRangePickerProps {
  checkIn: string;
  checkOut: string;
  onChange: (values: { checkIn: string; checkOut: string }) => void;
}

function formatDisplayDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = checkIn ? new Date(checkIn) : undefined;
    const to = checkOut ? new Date(checkOut) : undefined;
    return from || to ? { from, to } : undefined;
  });

  function handleSelect(selected: DateRange | undefined) {
    setRange(selected);

    const fromStr = selected?.from?.toISOString().slice(0, 10) ?? "";
    const toStr = selected?.to?.toISOString().slice(0, 10) ?? "";

    onChange({ checkIn: fromStr, checkOut: toStr });
  }

  const checkInLabel = formatDisplayDate(checkIn) || "Check-in";
  const checkOutLabel = formatDisplayDate(checkOut) || "Check-out";

  const today = new Date();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
      >
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-0.5">
          Dates
        </div>
        <div className="text-sm text-gray-800">
          {checkIn || checkOut
            ? `${checkInLabel} → ${checkOutLabel}`
            : "Add dates"}
        </div>
      </button>

      {open && (
        <div className="absolute z-40 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
          <DayPicker
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={handleSelect}
            fromMonth={today}
            disabled={{ before: today }}
            pagedNavigation
            modifiersClassNames={{
              selected: "bg-blue-600 text-white",
              range_start: "bg-blue-600 text-white rounded-l-full",
              range_end: "bg-blue-600 text-white rounded-r-full",
              range_middle: "bg-blue-100 text-blue-700",
            }}
          />

          <div className="flex justify-end mt-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setRange(undefined);
                onChange({ checkIn: "", checkOut: "" });
              }}
              className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-1.5 text-xs rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
