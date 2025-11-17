import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProfileResponse } from "../types/api";
import type { FormEvent } from "react";

interface OverviewTabProps {
  profile: ProfileResponse;
  avatarUrl: string;
  avatarAlt: string;
  setAvatarUrl: (v: string) => void;
  setAvatarAlt: (v: string) => void;
  handleAvatarSubmit: (e: FormEvent) => void;
}

export default function OverviewTab({
  profile,
  avatarUrl,
  avatarAlt,
  setAvatarUrl,
  setAvatarAlt,
  handleAvatarSubmit,
}: OverviewTabProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-4">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={profile.avatar?.url || "https://placehold.co/160x160"}
            alt={profile.avatar?.alt || profile.name}
            className="w-28 h-28 rounded-full object-cover border border-gray-200"
          />

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-gray-600">{profile.email}</p>

            <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  profile.venueManager
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {profile.venueManager ? "Venue Manager" : "Customer"}
              </span>

              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Edit profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsEditOpen(false)}
            />

            <motion.div
              className="relative z-50 bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Edit profile
                  </h2>
                  <p className="text-sm text-gray-500">
                    Update your avatar and alt text.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  handleAvatarSubmit(e);
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="avatarUrl"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Image URL
                  </label>
                  <input
                    id="avatarUrl"
                    type="url"
                    placeholder="https://…"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="avatarAlt"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Alt text (optional)
                  </label>
                  <input
                    id="avatarAlt"
                    type="text"
                    placeholder="Profile picture"
                    value={avatarAlt}
                    onChange={(e) => setAvatarAlt(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
