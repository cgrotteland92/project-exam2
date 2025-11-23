import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { useAuth } from "../../../hooks/useAuth";
import { updateVenue } from "../../../api/venuesApi";
import type { Venue } from "../../../types/api";
import VenueForm, { type VenueFormValues } from "../VenueForm";

interface EditVenueModalProps {
  venue: Venue;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (venue: Venue) => void;
}

export default function EditVenueModal({
  venue,
  isOpen,
  onClose,
  onUpdated,
}: EditVenueModalProps) {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const initialValues: Partial<VenueFormValues> = {
    name: venue.name,
    description: venue.description ?? "",
    price: String(venue.price),
    maxGuests: String(venue.maxGuests),
    mediaUrl: venue.media?.[0]?.url ?? "",
    mediaAlt: venue.media?.[0]?.alt ?? "",
    address: venue.location?.address ?? "",
    city: venue.location?.city ?? "",
    country: venue.location?.country ?? "",
    wifi: venue.meta?.wifi ?? false,
    parking: venue.meta?.parking ?? false,
    breakfast: venue.meta?.breakfast ?? false,
    pets: venue.meta?.pets ?? false,
  };

  async function handleSubmit(values: VenueFormValues) {
    if (!token) {
      toast.error("You must be logged in as a venue manager.");
      return;
    }

    const priceNumber = Number(values.price);
    const guestsNumber = Number(values.maxGuests);

    if (!priceNumber || priceNumber <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    if (!guestsNumber || guestsNumber < 1) {
      toast.error("Max guests must be at least 1.");
      return;
    }

    try {
      setIsSubmitting(true);

      const updated = await updateVenue(
        venue.id,
        {
          name: values.name.trim(),
          description: values.description.trim() || undefined,
          price: priceNumber,
          maxGuests: guestsNumber,
          media: values.mediaUrl
            ? [
                {
                  url: values.mediaUrl.trim(),
                  alt: values.mediaAlt.trim() || undefined,
                },
              ]
            : undefined,
          location:
            values.address || values.city || values.country
              ? {
                  address: values.address.trim() || undefined,
                  city: values.city.trim() || undefined,
                  country: values.country.trim() || undefined,
                }
              : undefined,
          meta: {
            wifi: values.wifi,
            parking: values.parking,
            breakfast: values.breakfast,
            pets: values.pets,
          },
        },
        token
      );

      toast.success("Venue updated!");
      onUpdated(updated);
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update venue";
      toast.error(message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-md flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Edit venue
        </h2>

        <VenueForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Save changes"
          isSubmitting={isSubmitting}
        />
      </motion.div>
    </div>
  );
}
