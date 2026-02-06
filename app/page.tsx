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

  // Load bookmarks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("htn_bookmarks");
    if (stored) {
      try {
        setBookmarkedEvents(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse bookmarks");
      }
    }
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem("htn_bookmarks", JSON.stringify(bookmarkedEvents));
  }, [bookmarkedEvents]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("https://api.hackthenorth.com/v3/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data: TEvent[] = await response.json();
        // Sort by start_time initially
        const sortedEvents = data.sort((a, b) => a.start_time - b.start_time);
        setEvents(sortedEvents);
        toast.success("Events loaded", {
          description: `${sortedEvents.length} events ready to explore.`,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to load events", {
          description: "Please try refreshing the page.",
        });
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
      element.classList.add("ring-4", "ring-blue-400", "ring-opacity-75");
      setTimeout(() => {
        element.classList.remove("ring-4", "ring-blue-400", "ring-opacity-75");
      }, 2000);
    }
  };

  const toggleBookmark = (eventId: number) => {
    setBookmarkedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  // Filter events based on login status, search, type, and bookmarks
  const filteredEvents = events.filter((event) => {
    if (!isLoggedIn && event.permission === "private") {
      return false;
    }
    if (showBookmarked && !bookmarkedEvents.includes(event.id)) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = event.name.toLowerCase().includes(query);
      const matchesDescription = event.description?.toLowerCase().includes(query);
      const matchesSpeakers = event.speakers.some((s) =>
        s.name.toLowerCase().includes(query)
      );
      if (!matchesName && !matchesDescription && !matchesSpeakers) {
        return false;
      }
    }
    if (selectedType !== "all" && event.event_type !== selectedType) {
      return false;
    }
    return true;
  });

  const publicEventsCount = events.filter((e) => e.permission === "public").length;
  const privateEventsCount = events.filter((e) => e.permission === "private").length;

  return (
    <div className="min-h-screen cutting-board-bg">
      <Navbar onLoginClick={() => setIsLoginModalOpen(true)} />
      <PaperPlane />

      <main className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <HeroSection
            isLoggedIn={isLoggedIn}
            publicCount={publicEventsCount}
            privateCount={privateEventsCount}
            onLoginClick={() => setIsLoginModalOpen(true)}
          />

          {/* Stats Section */}
          {!loading && events.length > 0 && (
            <StatsSection events={events} isLoggedIn={isLoggedIn} />
          )}

          {/* Filters */}
          {!loading && events.length > 0 && (
            <EventFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              showBookmarked={showBookmarked}
              onToggleBookmarked={() => setShowBookmarked(!showBookmarked)}
              bookmarkedCount={bookmarkedEvents.length}
            />
          )}

          {/* Loading State */}
          {loading && <LoadingSkeleton />}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center items-center py-20"
            >
              <div className="origami-card px-8 py-6 border-l-4 border-red-500 max-w-md">
                <p className="text-[#2a2a2a] font-bold text-lg mb-2">
                  Something went wrong
                </p>
                <p className="text-[#666] mb-4">{error}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="paper-btn px-6 py-2 rounded"
                >
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* No Results */}
          <AnimatePresence mode="wait">
            {!loading && !error && filteredEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-center items-center py-20"
              >
                <div className="origami-card px-8 py-8 text-center max-w-md">
                  <p className="text-[#2a2a2a] font-bold text-lg mb-2">
                    {showBookmarked ? "No favorites yet" : "No events found"}
                  </p>
                  <p className="text-[#666] text-sm">
                    {showBookmarked
                      ? "Click the heart icon on events to add them to your favorites."
                      : "Try adjusting your search or filters."}
                  </p>
                  {(searchQuery || selectedType !== "all" || showBookmarked) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedType("all");
                        setShowBookmarked(false);
                      }}
                      className="paper-btn px-6 py-2 rounded mt-4"
                    >
                      Clear Filters
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Events Grid */}
          {!loading && !error && filteredEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <div
                  key={event.id}
                  ref={(el) => {
                    if (el) eventRefs.current.set(event.id, el);
                  }}
                >
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

          {/* Results count */}
          {!loading && !error && filteredEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-8"
            >
              <span className="stats-paper px-4 py-2 rounded text-sm text-[#666]">
                Showing {filteredEvents.length} of{" "}
                {isLoggedIn ? events.length : publicEventsCount} events
              </span>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
