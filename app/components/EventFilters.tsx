"use client";

import { TEventType } from "../types";
import { motion } from "framer-motion";
import { Search, Filter, Mic2, Zap, BookOpen, LayoutGrid, Heart } from "lucide-react";

interface EventFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: TEventType | "all";
  onTypeChange: (type: TEventType | "all") => void;
  showBookmarked: boolean;
  onToggleBookmarked: () => void;
  bookmarkedCount: number;
}

export default function EventFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  showBookmarked,
  onToggleBookmarked,
  bookmarkedCount,
}: EventFiltersProps) {
  const eventTypes: { value: TEventType | "all"; label: string; icon: React.ReactNode }[] = [
    { value: "all", label: "All", icon: <LayoutGrid size={16} /> },
    { value: "workshop", label: "Workshops", icon: <BookOpen size={16} /> },
    { value: "activity", label: "Activities", icon: <Zap size={16} /> },
    { value: "tech_talk", label: "Tech Talks", icon: <Mic2 size={16} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8 space-y-4"
    >
      {/* Search Bar */}
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search events, speakers, descriptions..."
          className="paper-input w-full pl-12 pr-4 py-4 rounded text-base"
          aria-label="Search events"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-[#888] mr-2">
          <Filter size={16} />
          <span className="text-sm font-medium">Filter:</span>
        </div>

        {eventTypes.map((type, index) => (
          <motion.button
            key={type.value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTypeChange(type.value)}
            className={`px-4 py-2.5 rounded text-sm font-medium flex items-center gap-2 transition-all ${
              selectedType === type.value
                ? "paper-btn"
                : "bg-[#1a1a1a] text-[#888] hover:bg-[#252525] hover:text-[#aaa] border-2 border-[#2a2a2a]"
            }`}
            aria-pressed={selectedType === type.value}
          >
            {type.icon}
            {type.label}
          </motion.button>
        ))}

        {/* Bookmarked Filter */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleBookmarked}
          className={`px-4 py-2.5 rounded text-sm font-medium flex items-center gap-2 transition-all ml-auto ${
            showBookmarked
              ? "paper-btn"
              : "bg-[#1a1a1a] text-[#888] hover:bg-[#252525] hover:text-[#aaa] border-2 border-[#2a2a2a]"
          }`}
          aria-pressed={showBookmarked}
        >
          <Heart size={16} fill={showBookmarked ? "currentColor" : "none"} />
          Favorites
          {bookmarkedCount > 0 && (
            <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
              {bookmarkedCount}
            </span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
