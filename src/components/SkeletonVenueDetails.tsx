import { motion } from "framer-motion";

export default function SkeletonVenueDetails() {
  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <motion.div
          className="w-full h-72 md:h-96 bg-gray-200 animate-pulse rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="h-7 w-1/2 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded mt-4"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="h-5 w-1/4 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="h-5 w-1/3 bg-gray-200 rounded mb-3"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </motion.div>
      </div>
    </section>
  );
}
