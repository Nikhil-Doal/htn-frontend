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

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const formatEventType = (type: string) =>
    type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const getDuration = (start: number, end: number) => {
    const mins = (end - start) / 60000;
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
  };

  const getEventIcon = (type: string) => {
    if (type === "workshop") return <BookOpen size={14} />;
    if (type === "activity") return <Zap size={14} />;
    if (type === "tech_talk") return <Mic2 size={14} />;
    return null;
  };

  const eventUrl = isLoggedIn ? event.private_url : event.public_url;
  const isBookmarked = bookmarkedEvents.includes(event.id);

  const relatedEvents = event.related_events
    .map((id) => allEvents.find((e) => e.id === id))
    .filter((e): e is TEvent => e !== undefined && (isLoggedIn || e.permission === "public"));

  const handleBookmark = () => {
    onToggleBookmark(event.id);
    if (!isBookmarked) toast.success(`"${event.name}" bookmarked`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="event-card-wrapper h-full"
    >
      <article className="event-card p-6 h-full flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex flex-wrap gap-2">
            <span className={`badge-${event.event_type} px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5`}>
              {getEventIcon(event.event_type)}
              {formatEventType(event.event_type)}
            </span>
            {event.permission === "private" && (
              <span className="badge-private px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5">
                <Lock size={12} />
                Private
              </span>
            )}
          </div>
          <button
            onClick={handleBookmark}
            className={`bookmark-btn ${isBookmarked ? "active" : ""} text-[#ccc] hover:text-pink-400`}
          >
            <Heart size={20} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        <h3 className="font-castle text-xl text-[#2a2a2a] mb-3">{event.name}</h3>

        <div className="flex flex-wrap gap-4 text-sm text-[#555] mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-[#888]" />
            <span>{formatDate(event.start_time)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-[#888]" />
            <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
          </div>
          <span className="stats-paper px-2 py-0.5 rounded text-xs font-medium text-[#666]">
            {getDuration(event.start_time, event.end_time)}
          </span>
        </div>

        <div className="fold-divider mb-4" />

        {event.speakers.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-xs text-[#888] uppercase tracking-wider mb-2">
              <Users size={12} />
              <span>Speakers</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {event.speakers.map((speaker, idx) => (
                <span key={idx} className="stats-paper px-3 py-1 rounded text-sm text-[#3a3a3a] font-medium flex items-center gap-2">
                  {speaker.profile_pic && (
                    <img
                      src={speaker.profile_pic}
                      alt={speaker.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  {speaker.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {event.description && (
          <p className="text-sm text-[#555] mb-4 leading-relaxed flex-grow">{event.description}</p>
        )}

        {eventUrl && (
          <a
            href={eventUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="paper-btn inline-flex items-center justify-center gap-2 px-5 py-3 rounded text-sm mb-4"
          >
            <ExternalLink size={16} />
            {isLoggedIn ? "Join Event" : "Learn More"}
          </a>
        )}

        {relatedEvents.length > 0 && (
          <div className="mt-auto pt-4 border-t-2 border-dashed border-[#d4c4a8]">
            <div className="flex items-center gap-1.5 text-xs text-[#888] uppercase tracking-wider mb-2">
              <Link2 size={12} />
              <span>Related Events</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {relatedEvents.slice(0, 3).map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onEventClick(rel.id)}
                  className="related-chip px-3 py-1.5 rounded text-xs"
                >
                  {rel.name.length > 25 ? rel.name.substring(0, 25) + "..." : rel.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </article>
    </motion.div>
  );
}
