"use client";

import { motion } from "framer-motion";
import { Calendar, Users, Lock, Globe } from "lucide-react";
import { TEvent } from "../types";

interface StatsSectionProps {
  events: TEvent[];
  isLoggedIn: boolean;
}

export default function StatsSection({ events, isLoggedIn }: StatsSectionProps) {
  const publicCount = events.filter((e) => e.permission === "public").length;
  const privateCount = events.filter((e) => e.permission === "private").length;
  const totalSpeakers = events.reduce((acc, e) => acc + e.speakers.length, 0);

  const stats = [
    {
      icon: <Calendar size={22} />,
      value: isLoggedIn ? events.length : publicCount,
      label: "Total Events",
      color: "text-blue-600",
    },
    {
      icon: <Users size={22} />,
      value: totalSpeakers,
      label: "Speakers",
      color: "text-emerald-600",
    },
    {
      icon: <Globe size={22} />,
      value: publicCount,
      label: "Public Events",
      color: "text-teal-600",
    },
    {
      icon: <Lock size={22} />,
      value: privateCount,
      label: "Private Events",
      color: isLoggedIn ? "text-pink-600" : "text-gray-400",
      locked: !isLoggedIn,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          whileHover={{ scale: 1.03 }}
          className={`stats-paper p-5 rounded text-center ${stat.locked ? "opacity-60" : ""}`}
        >
          <div className={`${stat.color} mb-2 flex justify-center`}>{stat.icon}</div>
          <div className="font-castle text-3xl text-[#2a2a2a] mb-1">
            {stat.locked ? "?" : stat.value}
          </div>
          <div className="text-xs text-[#888] uppercase tracking-wider">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}
