import Button from "../../ui/Button";

interface VenueBookingCardProps {
  price: number;
  maxGuests: number;
  onBookClick: () => void;
}

export default function VenueBookingCard({
  price,
  maxGuests,
  onBookClick,
}: VenueBookingCardProps) {
  return (
    <div className="relative">
      <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
        <div className="flex justify-between items-end pb-4 border-b border-gray-100">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {price} NOK
            </span>
            <span className="text-gray-500 text-sm"> / night</span>
          </div>
          <div className="text-sm text-gray-500">Up to {maxGuests} guests</div>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full text-lg shadow-blue-200 shadow-lg"
            onClick={onBookClick}
          >
            Check Availability
          </Button>
          <p className="text-xs text-center text-gray-400">
            You won't be charged yet
          </p>
        </div>
      </div>
    </div>
  );
}
