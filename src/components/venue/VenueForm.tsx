import { useState, type FormEvent } from "react";
import Button from "../ui/Button";

export interface VenueFormValues {
  name: string;
  description: string;
  price: string;
  maxGuests: string;
  rating: string;
  media: { url: string; alt: string }[];
  address: string;
  city: string;
  country: string;
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
}

interface VenueFormProps {
  initialValues?: Partial<VenueFormValues>;
  onSubmit: (values: VenueFormValues, e: FormEvent) => void | Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

const defaultValues: VenueFormValues = {
  name: "",
  description: "",
  price: "",
  maxGuests: "1",
  rating: "0",
  media: [],
  address: "",
  city: "",
  country: "",
  wifi: false,
  parking: false,
  breakfast: false,
  pets: false,
};

export default function VenueForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  isSubmitting = false,
}: VenueFormProps) {
  const [values, setValues] = useState<VenueFormValues>({
    ...defaultValues,
    ...initialValues,
  });

  const [tempUrl, setTempUrl] = useState("");
  const [tempAlt, setTempAlt] = useState("");

  function handleChange<K extends keyof VenueFormValues>(
    key: K,
    value: VenueFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  const handleAddImage = () => {
    if (!tempUrl.trim()) return;
    if (values.media.length >= 5) return;

    const newImage = { url: tempUrl, alt: tempAlt };

    setValues((prev) => ({
      ...prev,
      media: [...prev.media, newImage],
    }));

    setTempUrl("");
    setTempAlt("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setValues((prev) => ({
      ...prev,
      media: prev.media.filter((_, index) => index !== indexToRemove),
    }));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit(values, e);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Cozy cabin by the fjord"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price per night (NOK)
          </label>
          <input
            type="number"
            min={1}
            value={values.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="1200"
            required
          />
        </div>

        {/* Guests*/}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max guests
            </label>
            <input
              type="number"
              min={1}
              value={values.maxGuests}
              onChange={(e) => handleChange("maxGuests", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="4"
              required
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (0-5)
            </label>
            <input
              type="number"
              min={0}
              max={5}
              step={1}
              value={values.rating}
              onChange={(e) => handleChange("rating", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Describe your venue..."
          required
        />
      </div>

      {/* Media Section */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Images (Max 5)
          </label>
          <span className="text-xs text-gray-500 font-medium">
            {values.media.length} / 5
          </span>
        </div>

        {values.media.length > 0 && (
          <div className="space-y-2">
            {values.media.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-10 h-10 rounded-md object-cover bg-gray-100"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/100?text=Invalid")
                    }
                  />
                  <span className="text-sm text-gray-600 truncate max-w-[200px]">
                    {item.url}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium px-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {values.media.length < 5 ? (
          <div className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <div>
              <input
                type="url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Image URL..."
              />
            </div>
            <div>
              <input
                type="text"
                value={tempAlt}
                onChange={(e) => setTempAlt(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Alt text"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddImage}
              disabled={!tempUrl}
            >
              Add
            </Button>
          </div>
        ) : (
          <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded-lg border border-orange-100">
            Maximum of 5 images reached.
          </p>
        )}
      </div>

      {/* Location */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            value={values.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Street"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={values.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Oslo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <input
            type="text"
            value={values.country}
            onChange={(e) => handleChange("country", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Norway"
          />
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={values.wifi}
            onChange={(e) => handleChange("wifi", e.target.checked)}
            className="rounded text-gray-900 focus:ring-gray-900"
          />
          Wifi
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={values.parking}
            onChange={(e) => handleChange("parking", e.target.checked)}
            className="rounded text-gray-900 focus:ring-gray-900"
          />
          Parking
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={values.breakfast}
            onChange={(e) => handleChange("breakfast", e.target.checked)}
            className="rounded text-gray-900 focus:ring-gray-900"
          />
          Breakfast
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={values.pets}
            onChange={(e) => handleChange("pets", e.target.checked)}
            className="rounded text-gray-900 focus:ring-gray-900"
          />
          Pets allowed
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
