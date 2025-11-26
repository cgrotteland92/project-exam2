import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import { getProfile } from "../api/authApi";
import { cancelBooking } from "../api/bookingsApi";
import { getManagerVenuesWithBookings } from "../api/venuesApi";
import type { ProfileResponse, Venue } from "../types/api";

import BookingsTab from "../components/venue/costumer/BookingsTab";
import VenuesTab from "../components/venue/VenuesTab";
import ManagerVenueBookings from "../components/venue/manager/ManagerVenueBookings";
import ProfileHeader from "../components/profile/ProfileHeader";
import UpdateAvatarModal from "../components/profile/UpdateAvatarModal";

export default function Profile() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"bookings" | "venues">("bookings");

  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [managerVenues, setManagerVenues] = useState<Venue[]>([]);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const loadProfileData = useCallback(async () => {
    if (!user || !token) return;

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
  }, [user, token]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

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
              bookings: prev.bookings?.filter((b) => b.id !== bookingId),
              _count: prev._count
                ? {
                    ...prev._count,
                    bookings: Math.max(0, (prev._count.bookings ?? 1) - 1),
                  }
                : prev._count,
            }
          : prev
      );
      toast.success("Booking cancelled");
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
      <section className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No profile data found.</p>
      </section>
    );
  }

  const isManager = profile.venueManager;

  return (
    <section className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-6">
        <ProfileHeader
          profile={profile}
          onEditAvatar={() => setShowAvatarModal(true)}
        />

        {/* Costumer */}
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

        {/* 3. Manager */}
        {isManager && (
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100/50">
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
                    onVenueDeleted={(id) =>
                      setManagerVenues((prev) =>
                        prev.filter((v) => v.id !== id)
                      )
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <UpdateAvatarModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        username={user?.name || ""}
        token={token || ""}
        onAvatarUpdated={loadProfileData}
      />
    </section>
  );
}
