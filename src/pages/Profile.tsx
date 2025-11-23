import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import { getProfile, updateAvatar } from "../api/authApi";
import { cancelBooking } from "../api/bookingsApi";
import { getManagerVenuesWithBookings } from "../api/venuesApi";

import type { ProfileResponse, Venue } from "../types/api";
import Button from "../components/ui/Button";
import BookingsTab from "../components/venue/costumer/BookingsTab";
import VenuesTab from "../components/venue/VenuesTab";
import ManagerVenueBookings from "../components/venue/manager/ManagerVenueBookings";

export default function Profile() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarAlt, setAvatarAlt] = useState("");

  const [activeTab, setActiveTab] = useState<"bookings" | "venues">("bookings");
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [managerVenues, setManagerVenues] = useState<Venue[]>([]);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    async function load() {
      if (!user || !token) return;
      setLoading(true);

      try {
        const data = await getProfile(user.name, token, {
          venues: true,
          bookings: true,
          count: true,
        });
        setProfile(data);

        if (data.venueManager) {
          const venues = await getManagerVenuesWithBookings(data.name, token);
          setManagerVenues(venues);
        } else {
          setManagerVenues([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, token]);

  async function handleAvatarSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user || !token) return;

    if (!avatarUrl.trim()) {
      toast.error("Please enter a valid URL.");
      return;
    }

    try {
      await updateAvatar(user.name, token, avatarUrl.trim(), avatarAlt.trim());
      toast.success("Avatar updated successfully!");

      const refreshed = await getProfile(user.name, token, {
        venues: true,
        bookings: true,
        count: true,
      });
      setProfile(refreshed);
      setAvatarUrl("");
      setAvatarAlt("");
      setShowAvatarModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update avatar.");
    }
  }

  async function handleCancelBooking(bookingId: string) {
    if (!token || !profile) return;

    const confirmed = window.confirm("Are you sure?");
    if (!confirmed) return;

    try {
      await cancelBooking(bookingId, token);

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              bookings: prev.bookings?.filter(
                (booking) => booking.id !== bookingId
              ),
              _count: prev._count
                ? {
                    ...prev._count,
                    bookings: Math.max(0, (prev._count.bookings ?? 1) - 1),
                  }
                : prev._count,
            }
          : prev
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel booking.");
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50 flex items-center justify-center">
        <p className="text-gray-600">No profile data found.</p>
      </section>
    );
  }

  const isManager = profile.venueManager;

  return (
    <section className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative group">
              <img
                src={profile.avatar?.url || "https://placehold.co/200x200"}
                alt={profile.avatar?.alt || profile.name}
                className="w-32 h-32 rounded-2xl object-cover border-2 border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300"
              />
              <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {profile.name}
              </h1>
              <p className="text-gray-500 mb-4">{profile.email}</p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
                <span
                  className={`inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-full ${
                    isManager
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {isManager ? "Venue Manager" : "Customer"}
                </span>

                {profile._count && (
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600">
                      <strong className="text-gray-900 font-semibold">
                        {profile._count.bookings ?? 0}
                      </strong>{" "}
                      Bookings
                    </span>
                    {isManager && (
                      <span className="text-gray-600">
                        <strong className="text-gray-900 font-semibold">
                          {profile._count.venues ?? 0}
                        </strong>{" "}
                        Venues
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setShowAvatarModal(true)}
            >
              Edit avatar
            </Button>
          </div>
        </div>

        {/* Content Section */}
        {!isManager && (
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100/50">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Your bookings
            </h2>
            <BookingsTab
              bookings={profile.bookings}
              onCancelBooking={handleCancelBooking}
            />
          </div>
        )}

        {isManager && (
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100/50">
            {/* Tabs */}
            <div className="mb-8 flex gap-1 bg-gray-50 rounded-xl p-1 w-fit">
              {[
                { id: "bookings", label: "Bookings" },
                { id: "venues", label: "Your Venues" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "bookings" | "venues")}
                  className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "bookings" && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-10"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Your bookings
                    </h2>
                    <BookingsTab
                      bookings={profile.bookings}
                      onCancelBooking={handleCancelBooking}
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Bookings for your venues
                    </h2>
                    <ManagerVenueBookings venues={managerVenues} />
                  </div>
                </motion.div>
              )}

              {activeTab === "venues" && (
                <motion.div
                  key="venues"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <VenuesTab
                    venues={managerVenues}
                    onVenueUpdated={(updated) =>
                      setManagerVenues((prev) =>
                        prev.map((v) =>
                          v.id === updated.id ? { ...v, ...updated } : v
                        )
                      )
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-md flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Update avatar
            </h2>
            <form onSubmit={handleAvatarSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="avatarUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Image URL
                </label>
                <input
                  id="avatarUrl"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                />
              </div>
              <div>
                <label
                  htmlFor="avatarAlt"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Alt text (optional)
                </label>
                <input
                  id="avatarAlt"
                  type="text"
                  value={avatarAlt}
                  onChange={(e) => setAvatarAlt(e.target.value)}
                  placeholder="Profile picture"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setShowAvatarModal(false);
                    setAvatarUrl("");
                    setAvatarAlt("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save avatar
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
}
