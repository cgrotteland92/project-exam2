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
  onDelete?: () => void;
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
  onDelete,
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

  const inputClass =
    "w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-stone-400 text-stone-900";
  const labelClass = "block text-sm font-semibold text-stone-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={labelClass}>Name</label>
          <input
            type="text"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={inputClass}
            placeholder="Cozy cabin by the fjord"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Price per night (NOK)</label>
          <input
            type="number"
            min={1}
            value={values.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className={inputClass}
            placeholder="1200"
            required
          />
        </div>

        {/* Guests & Rating */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Max guests</label>
            <input
              type="number"
              min={1}
              value={values.maxGuests}
              onChange={(e) => handleChange("maxGuests", e.target.value)}
              className={inputClass}
              placeholder="4"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Rating (0-5)</label>
            <input
              type="number"
              min={0}
              max={5}
              step={1}
              value={values.rating}
              onChange={(e) => handleChange("rating", e.target.value)}
              className={inputClass}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className={`${inputClass} h-32 resize-none`}
          placeholder="Describe your venue..."
          required
        />
      </div>

      {/* Media Section */}
      <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100 space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-semibold text-stone-700">
            Images (Max 5)
          </label>
          <span className="text-xs text-stone-500 font-medium">
            {values.media.length} / 5
          </span>
        </div>

        {values.media.length > 0 && (
          <div className="space-y-2">
            {values.media.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-2 rounded-lg border border-stone-200 shadow-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-10 h-10 rounded-md object-cover bg-stone-100 ring-1 ring-stone-100"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/100?text=Invalid")
                    }
                  />
                  <span className="text-sm text-stone-600 truncate max-w-[200px]">
                    {item.url}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
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
                className={`${inputClass} text-sm`}
                placeholder="Image URL..."
              />
            </div>
            <div>
              <input
                type="text"
                value={tempAlt}
                onChange={(e) => setTempAlt(e.target.value)}
                className={`${inputClass} text-sm`}
                placeholder="Alt text"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleAddImage}
              disabled={!tempUrl}
            >
              Add
            </Button>
          </div>
        ) : (
          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 font-medium">
            Maximum of 5 images reached.
          </p>
        )}
      </div>

      {/* Location */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Address</label>
          <input
            type="text"
            value={values.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className={inputClass}
            placeholder="Street"
          />
        </div>
        <div>
          <label className={labelClass}>City</label>
          <input
            type="text"
            value={values.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className={inputClass}
            placeholder="Oslo"
          />
        </div>
        <div>
          <label className={labelClass}>Country</label>
          <input
            type="text"
            value={values.country}
            onChange={(e) => handleChange("country", e.target.value)}
            className={inputClass}
            placeholder="Norway"
          />
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-100">
        <label className="inline-flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={values.wifi}
            onChange={(e) => handleChange("wifi", e.target.checked)}
            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-stone-300"
          />
          Wifi
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={values.parking}
            onChange={(e) => handleChange("parking", e.target.checked)}
            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-stone-300"
          />
          Parking
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={values.breakfast}
            onChange={(e) => handleChange("breakfast", e.target.checked)}
            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-stone-300"
          />
          Breakfast
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={values.pets}
            onChange={(e) => handleChange("pets", e.target.checked)}
            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-stone-300"
          />
          Pets allowed
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-stone-100 mt-8">
        {onDelete && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onDelete}
            className="text-red-600 hover:bg-red-50 border-red-100 hover:border-red-200 mr-auto sm:mr-0"
          >
            Delete
          </Button>
        )}

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
