import { Icons } from "./VenueIcons";

interface VenueFacilitiesProps {
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
}

export default function VenueFacilities({ meta }: VenueFacilitiesProps) {
  return (
    <section>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        What this place offers
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Wifi */}
        <div
          className={`flex items-center gap-3 p-3 rounded-xl border ${
            meta?.wifi
              ? "border-blue-100 bg-blue-50 text-blue-700"
              : "border-gray-100 bg-gray-50 text-gray-400"
          }`}
        >
          <Icons.Wifi />
          <span className={!meta?.wifi ? "line-through" : ""}>Wifi</span>
        </div>

        {/* Parking */}
        <div
          className={`flex items-center gap-3 p-3 rounded-xl border ${
            meta?.parking
              ? "border-green-100 bg-green-50 text-green-700"
              : "border-gray-100 bg-gray-50 text-gray-400"
          }`}
        >
          <Icons.Car />
          <span className={!meta?.parking ? "line-through" : ""}>Parking</span>
        </div>

        {/* Breakfast */}
        <div
          className={`flex items-center gap-3 p-3 rounded-xl border ${
            meta?.breakfast
              ? "border-orange-100 bg-orange-50 text-orange-700"
              : "border-gray-100 bg-gray-50 text-gray-400"
          }`}
        >
          <Icons.Coffee />
          <span className={!meta?.breakfast ? "line-through" : ""}>
            Breakfast
          </span>
        </div>

        {/* Pets */}
        <div
          className={`flex items-center gap-3 p-3 rounded-xl border ${
            meta?.pets
              ? "border-purple-100 bg-purple-50 text-purple-700"
              : "border-gray-100 bg-gray-50 text-gray-400"
          }`}
        >
          <Icons.PawPrint />
          <span className={!meta?.pets ? "line-through" : ""}>
            Pets allowed
          </span>
        </div>
      </div>
    </section>
  );
}
