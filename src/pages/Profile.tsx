import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import { getProfile } from "../api/authApi";
import { cancelBooking } from "../api/bookingsApi";
import type { ProfileResponse } from "../types/api";

import BookingsTab from "../components/venue/costumer/BookingsTab";
import ProfileHeader from "../components/profile/ProfileHeader";
import UpdateAvatarModal from "../components/profile/UpdateAvatarModal";

export default function Profile() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [showAvatarModal, setShowAvatarModal] = useState(false);

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
      <section className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-600">No profile data found.</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          onEditAvatar={() => setShowAvatarModal(true)}
        />

        {/* Your Bookings */}
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-stone-100">
          <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">
            Your bookings
          </h2>
          <BookingsTab
            bookings={profile.bookings}
            onCancelBooking={handleCancelBooking}
          />
        </div>
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
