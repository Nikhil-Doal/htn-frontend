"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TEvent, TEventType } from "./types";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import EventCard from "./components/EventCard";
import EventFilters from "./components/EventFilters";
import PaperPlane from "./components/PaperPlane";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import LoadingSkeleton from "./components/LoadingSkeleton";
import Footer from "./components/Footer";
import { toast } from "sonner";

export default function Home() {
  const [events, setEvents] = useState<TEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<TEventType | "all">("all");
  const [bookmarkedEvents, setBookmarkedEvents] = useState<number[]>([]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const { isLoggedIn } = useAuth();
  const eventRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    const stored = localStorage.getItem("htn_bookmarks");
    if (stored) {
      try {
        setBookmarkedEvents(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("htn_bookmarks", JSON.stringify(bookmarkedEvents));
  }, [bookmarkedEvents]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("https://api.hackthenorth.com/v3/events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data: TEvent[] = await response.json();
        setEvents(data.sort((a, b) => a.start_time - b.start_time));
        toast.success("Events loaded");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const scrollToEvent = (eventId: number) => {
    const element = eventRefs.current.get(eventId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("ring-4", "ring-blue-400");
      setTimeout(() => element.classList.remove("ring-4", "ring-blue-400"), 2000);
    }
  };

  const toggleBookmark = (eventId: number) => {
    setBookmarkedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const filteredEvents = events.filter((event) => {
    if (!isLoggedIn && event.permission === "private") return false;
    if (showBookmarked && !bookmarkedEvents.includes(event.id)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!event.name.toLowerCase().includes(q) &&
          !event.description?.toLowerCase().includes(q) &&
          !event.speakers.some((s) => s.name.toLowerCase().includes(q))) return false;
    }
    if (selectedType !== "all" && event.event_type !== selectedType) return false;
    return true;
  });

  const publicCount = events.filter((e) => e.permission === "public").length;
  const privateCount = events.filter((e) => e.permission === "private").length;

  return (
    <div className="min-h-screen cutting-board-bg">
      <Navbar onLoginClick={() => setIsLoginModalOpen(true)} />
      <PaperPlane />

      <main className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <HeroSection
            isLoggedIn={isLoggedIn}
            publicCount={publicCount}
            privateCount={privateCount}
            onLoginClick={() => setIsLoginModalOpen(true)}
          />

          {!loading && events.length > 0 && (
            <>
              <StatsSection events={events} isLoggedIn={isLoggedIn} />
              <EventFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                showBookmarked={showBookmarked}
                onToggleBookmarked={() => setShowBookmarked(!showBookmarked)}
                bookmarkedCount={bookmarkedEvents.length}
              />
            </>
          )}

          {loading && <LoadingSkeleton />}

          {error && (
            <div className="flex justify-center py-20">
              <div className="origami-card px-8 py-6 border-l-4 border-red-500 max-w-md">
                <p className="text-[#2a2a2a] font-bold text-lg mb-2">Something went wrong</p>
                <p className="text-[#666] mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="paper-btn px-6 py-2 rounded">
                  Try Again
                </button>
              </div>
            </div>
          )}

          <AnimatePresence>
            {!loading && !error && filteredEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-20"
              >
                <div className="origami-card px-8 py-8 text-center max-w-md">
                  <p className="text-[#2a2a2a] font-bold text-lg mb-2">
                    {showBookmarked ? "No favorites yet" : "No events found"}
                  </p>
                  <p className="text-[#666] text-sm">
                    {showBookmarked ? "Click the heart icon to add favorites." : "Try adjusting your filters."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!loading && !error && filteredEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <div key={event.id} ref={(el) => { if (el) eventRefs.current.set(event.id, el); }}>
                  <EventCard
                    event={event}
                    allEvents={events}
                    onEventClick={scrollToEvent}
                    index={index}
                    bookmarkedEvents={bookmarkedEvents}
                    onToggleBookmark={toggleBookmark}
                  />
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredEvents.length > 0 && (
            <p className="text-center mt-8 text-[#666] text-sm">
              Showing {filteredEvents.length} of {isLoggedIn ? events.length : publicCount} events
            </p>
          )}
        </div>
      </main>

      <Footer />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
