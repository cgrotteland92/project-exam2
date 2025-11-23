import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { useAuth } from "../../../hooks/useAuth";
import { createVenue } from "../../../api/venuesApi";
import type { Venue } from "../../../types/api";
import VenueForm, { type VenueFormValues } from "../VenueForm";

interface CreateVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (venue: Venue) => void;
}

export default function CreateVenueModal({
  isOpen,
  onClose,
  onCreated,
}: CreateVenueModalProps) {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

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

      const newVenue = await createVenue(
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

      toast.success("Venue created!");
      onCreated(newVenue);
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create venue";
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
          Create new venue
        </h2>

        <VenueForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Create venue"
          isSubmitting={isSubmitting}
        />
      </motion.div>
    </div>
  );
}
