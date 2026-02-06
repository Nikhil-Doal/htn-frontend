"use client";

import { motion } from "framer-motion";

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="origami-card p-6"
        >
          <div className="flex gap-2 mb-4">
            <div className="paper-skeleton h-6 w-24 rounded" />
            <div className="paper-skeleton h-6 w-16 rounded" />
          </div>
          <div className="paper-skeleton h-7 w-3/4 rounded mb-3" />
          <div className="paper-skeleton h-4 w-1/2 rounded mb-4" />
          <div className="fold-divider mb-4" />
          <div className="paper-skeleton h-4 w-full rounded mb-2" />
          <div className="paper-skeleton h-4 w-5/6 rounded mb-2" />
          <div className="paper-skeleton h-4 w-4/6 rounded mb-4" />
          <div className="paper-skeleton h-10 w-32 rounded" />
        </motion.div>
      ))}
    </div>
  );
}
