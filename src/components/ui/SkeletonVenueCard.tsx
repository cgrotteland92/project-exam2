import { motion } from "framer-motion";

/**
 * Skeleton card for loading venues.
 * Used while venue data being fetched
 */

export default function SkeletonVenueCard() {
  return (
    <motion.div
      className="bg-gray-200 rounded-xl shadow-md h-72 animate-pulse"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    />
  );
}
