import { useState, type FormEvent } from "react";
import Button from "../ui/Button";

export interface VenueFormValues {
  name: string;
  description: string;
  price: string;
  maxGuests: string;
  mediaUrl: string;
  mediaAlt: string;
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
  mediaUrl: "",
  mediaAlt: "",
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

  function handleChange<K extends keyof VenueFormValues>(
    key: K,
    value: VenueFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit(values, e);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
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
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="1200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max guests
          </label>
          <input
            type="number"
            min={1}
            value={values.maxGuests}
            onChange={(e) => handleChange("maxGuests", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="4"
            required
          />
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
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Describe your venue, surroundings, and what makes it special."
        />
      </div>

      {/* Media */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={values.mediaUrl}
            onChange={(e) => handleChange("mediaUrl", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="https://…"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alt text
          </label>
          <input
            type="text"
            value={values.mediaAlt}
            onChange={(e) => handleChange("mediaAlt", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="Exterior of the venue"
          />
        </div>
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
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="Street and number"
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
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
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
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
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
          />
          Wifi
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={values.parking}
            onChange={(e) => handleChange("parking", e.target.checked)}
          />
          Parking
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={values.breakfast}
            onChange={(e) => handleChange("breakfast", e.target.checked)}
          />
          Breakfast
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={values.pets}
            onChange={(e) => handleChange("pets", e.target.checked)}
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
