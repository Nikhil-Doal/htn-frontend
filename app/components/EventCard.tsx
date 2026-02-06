"use client";

import { TEvent } from "../types";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  Users,
  ExternalLink,
  Lock,
  Link2,
  Heart,
  Mic2,
  Zap,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

interface EventCardProps {
  event: TEvent;
  allEvents: TEvent[];
  onEventClick: (eventId: number) => void;
  index: number;
  bookmarkedEvents: number[];
  onToggleBookmark: (eventId: number) => void;
}

export default function EventCard({
  event,
  allEvents,
  onEventClick,
  index,
  bookmarkedEvents,
  onToggleBookmark,
}: EventCardProps) {
  const { isLoggedIn } = useAuth();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatEventType = (type: string) => {
    return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getDuration = (start: number, end: number) => {
    const minutes = (end - start) / 60000;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "workshop":
        return <BookOpen size={14} />;
      case "activity":
        return <Zap size={14} />;
      case "tech_talk":
        return <Mic2 size={14} />;
      default:
        return null;
    }
  };

  const eventUrl = isLoggedIn ? event.private_url : event.public_url;
  const isBookmarked = bookmarkedEvents.includes(event.id);

  const relatedEventsList = event.related_events
    .map((id) => allEvents.find((e) => e.id === id))
    .filter((e): e is TEvent => e !== undefined)
    .filter((e) => isLoggedIn || e.permission === "public");

  const handleBookmark = () => {
    onToggleBookmark(event.id);
    if (!isBookmarked) {
      toast.success("Event bookmarked!", {
        description: `"${event.name}" added to your favorites.`,
      });
    }
  };

  // Check if event is happening soon (within 24 hours)
  const isUpcoming = event.start_time - Date.now() < 24 * 60 * 60 * 1000 && event.start_time > Date.now();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="event-card-wrapper h-full"
    >
      <article className="event-card p-6 h-full flex flex-col">
        {/* Header - Badges and Bookmark */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex flex-wrap gap-2">
            <span
              className={`badge-${event.event_type} px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5`}
            >
              {getEventIcon(event.event_type)}
              {formatEventType(event.event_type)}
            </span>
            {event.permission === "private" && (
              <span className="badge-private px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5">
                <Lock size={12} />
                Private
              </span>
            )}
            {isUpcoming && (
              <span className="bg-gradient-to-r from-red-400 to-orange-400 text-white px-3 py-1.5 rounded text-xs font-bold live-indicator">
                Soon!
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBookmark}
            className={`bookmark-btn flex-shrink-0 ${isBookmarked ? "active" : ""} text-[#ccc] hover:text-pink-400`}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Heart size={20} fill={isBookmarked ? "currentColor" : "none"} />
          </motion.button>
        </div>

        {/* Title */}
        <h3 className="font-castle text-xl text-[#2a2a2a] mb-3 leading-tight">
          {event.name}
        </h3>

        {/* Date/Time Info */}
        <div className="flex flex-wrap gap-4 text-sm text-[#555] mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-[#888]" />
            <span>{formatDate(event.start_time)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-[#888]" />
            <span>
              {formatTime(event.start_time)} - {formatTime(event.end_time)}
            </span>
          </div>
          <div className="stats-paper px-2 py-0.5 rounded text-xs font-medium text-[#666]">
            {getDuration(event.start_time, event.end_time)}
          </div>
        </div>

        {/* Divider */}
        <div className="fold-divider mb-4" />

        {/* Speakers */}
        {event.speakers.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-xs text-[#888] uppercase tracking-wider mb-2">
              <Users size={12} />
              <span>Speakers</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {event.speakers.map((speaker, idx) => (
                <span
                  key={idx}
                  className="stats-paper px-3 py-1 rounded text-sm text-[#3a3a3a] font-medium"
                >
                  {speaker.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-sm text-[#555] mb-4 leading-relaxed flex-grow">
            {event.description}
          </p>
        )}

        {/* Action Button */}
        {eventUrl && (
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={eventUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="paper-btn inline-flex items-center justify-center gap-2 px-5 py-3 rounded text-sm mb-4"
          >
            <ExternalLink size={16} />
            {isLoggedIn ? "Join Event" : "Learn More"}
          </motion.a>
        )}

        {/* Related Events */}
        {relatedEventsList.length > 0 && (
          <div className="mt-auto pt-4 border-t-2 border-dashed border-[#d4c4a8]">
            <div className="flex items-center gap-1.5 text-xs text-[#888] uppercase tracking-wider mb-2">
              <Link2 size={12} />
              <span>Related Events</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {relatedEventsList.slice(0, 3).map((relatedEvent) => (
                <motion.button
                  key={relatedEvent.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEventClick(relatedEvent.id)}
                  className="related-chip px-3 py-1.5 rounded text-xs"
                >
                  {relatedEvent.name.length > 25
                    ? relatedEvent.name.substring(0, 25) + "..."
                    : relatedEvent.name}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </article>
    </motion.div>
  );
}
