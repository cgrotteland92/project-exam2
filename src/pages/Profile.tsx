import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { getProfile, updateAvatar } from "../api/authApi";
import type { ProfileResponse } from "../types/api";

export default function Profile() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarAlt, setAvatarAlt] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    async function load() {
      if (!user || !token) return;
      try {
        const data = await getProfile(user.name, token);
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

      const refreshed = await getProfile(user.name, token);
      setProfile(refreshed);
      setAvatarUrl("");
      setAvatarAlt("");
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
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={profile.avatar?.url || "https://placehold.co/160x160"}
              alt={profile.avatar?.alt || profile.name}
              className="w-28 h-28 rounded-full object-cover border border-gray-200"
            />

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.name}
              </h1>
              <p className="text-gray-600">{profile.email}</p>

              <div className="mt-3">
                {profile.venueManager ? (
                  <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Venue Manager
                  </span>
                ) : (
                  <span className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Customer
                  </span>
                )}
              </div>
            </div>

            {profile._count && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl px-4 py-3 text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {profile._count.venues ?? 0}
                  </div>
                  <div className="text-xs text-gray-500">Venues</div>
                </div>
                <div className="bg-gray-50 rounded-xl px-4 py-3 text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {profile._count.bookings ?? 0}
                  </div>
                  <div className="text-xs text-gray-500">Bookings</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Update avatar
          </h2>
          <form
            onSubmit={handleAvatarSubmit}
            className="grid sm:grid-cols-3 gap-4"
          >
            <div className="sm:col-span-2">
              <label
                htmlFor="avatarUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Image URL
              </label>
              <input
                id="avatarUrl"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://…"
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
                value={avatarAlt}
                onChange={(e) => setAvatarAlt(e.target.value)}
                placeholder="Profile picture"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
              >
                Save avatar
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
