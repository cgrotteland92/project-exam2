import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { getProfile, updateAvatar } from "../api/authApi";
import { cancelBooking } from "../api/bookingsApi";
import type { ProfileResponse } from "../types/api";
import OverviewTab from "../components/OverviewTab";
import BookingsTab from "../components/BookingsTab";
import VenuesTab from "../components/VenuesTab";

export default function Profile() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarAlt, setAvatarAlt] = useState("");

  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "venues"
  >("overview");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    async function load() {
      if (!user || !token) return;
      try {
        const data = await getProfile(user.name, token, {
          venues: true,
          bookings: true,
          count: true,
        });
        setProfile(data);
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
    } catch (err) {
      console.error(err);
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
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No profile data found.</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-6 flex gap-6 border-b border-gray-200">
          {[
            { id: "overview", label: "Overview" },
            { id: "bookings", label: "Bookings", show: !profile.venueManager },
            { id: "venues", label: "Your Venues", show: profile.venueManager },
          ].map(
            (tab) =>
              tab.show !== false && (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3 py-2 -mb-px text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              )
          )}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <OverviewTab
                profile={profile}
                avatarUrl={avatarUrl}
                avatarAlt={avatarAlt}
                setAvatarUrl={setAvatarUrl}
                setAvatarAlt={setAvatarAlt}
                handleAvatarSubmit={handleAvatarSubmit}
              />
            </motion.div>
          )}

          {activeTab === "bookings" && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <BookingsTab
                bookings={profile.bookings}
                onCancelBooking={handleCancelBooking}
              />
            </motion.div>
          )}

          {activeTab === "venues" && (
            <motion.div
              key="venues"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <VenuesTab venues={profile.venues ?? []} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
