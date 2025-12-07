import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useAuth } from "../hooks/useAuth";
import { getManagerVenuesWithBookings } from "../api/venuesApi";
import type { Venue } from "../types/api";

import ManagerVenueBookings from "../components/venue/manager/ManagerVenueBookings";
import CreateVenueModal from "../components/venue/manager/Temp";
import VenuesTab from "../components/venue/VenuesTab";
import Button from "../components/ui/Button";

export default function Manager() {
  const { user, token } = useAuth();

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"bookings" | "venues">("bookings");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user || !token) return;

      setLoading(true);
      try {
        const data = await getManagerVenuesWithBookings(user.name, token);
        setVenues(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user, token]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  const totalVenues = venues.length;
  const totalBookings = venues.reduce(
    (sum, v) => sum + (v.bookings?.length ?? 0),
    0
  );

  return (
    <section className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-brand font-bold text-stone-900 mb-1">
              Manager dashboard
            </h1>
            <p className="text-stone-500">
              Manage your venues and keep track of upcoming bookings.
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => setShowCreateModal(true)}
            className="shadow-lg shadow-teal-900/10"
          >
            Create new venue
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
            <p className="text-sm font-medium text-stone-500 mb-1">
              Your venues
            </p>
            <p className="text-3xl font-bold text-stone-900">{totalVenues}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
            <p className="text-sm font-medium text-stone-500 mb-1">
              Total bookings
            </p>
            <p className="text-3xl font-bold text-stone-900">{totalBookings}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8 border border-stone-100 mt-4">
          {/* Tabs */}
          <div className="mb-8 flex gap-1 bg-stone-50 rounded-xl p-1 w-fit border border-stone-100">
            {[
              { id: "bookings", label: "Bookings" },
              { id: "venues", label: "Your venues" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as "bookings" | "venues")}
                className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-stone-900 shadow-sm ring-1 ring-stone-200"
                    : "text-stone-500 hover:text-stone-700 hover:bg-stone-100/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === "bookings" && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ManagerVenueBookings venues={venues} />
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
                  venues={venues}
                  onVenueUpdated={(updated) =>
                    setVenues((prev) =>
                      prev.map((v) =>
                        v.id === updated.id ? { ...v, ...updated } : v
                      )
                    )
                  }
                  onVenueDeleted={(deletedId) =>
                    setVenues((prev) => prev.filter((v) => v.id !== deletedId))
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showCreateModal && (
        <CreateVenueModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={(venue) => {
            setVenues((prev) => [venue, ...prev]);
          }}
        />
      )}
    </section>
  );
}
