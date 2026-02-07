"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, Calendar } from "lucide-react";

interface HeroSectionProps {
  isLoggedIn: boolean;
  publicCount: number;
  privateCount: number;
  onLoginClick: () => void;
}

export default function HeroSection({
  isLoggedIn,
  publicCount,
  privateCount,
  onLoginClick,
}: HeroSectionProps) {
  return (
    <header className="text-center mb-16 pt-4">
      {/* Main Title with Logo */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="mb-8"
      >
        <div className="flex items-center justify-center gap-6 relative">
          <motion.div
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src="/htn_logo.png"
              alt="Hack the North"
              width={100}
              height={100}
              className="object-contain"
              priority
            />
          </motion.div>

          <div className="text-left relative">
            <h1 className="font-castle paper-gradient-text text-4xl sm:text-5xl md:text-6xl leading-none mb-1">
              Hack the
            </h1>
            <h1 className="font-castle paper-gradient-text text-4xl sm:text-5xl md:text-6xl leading-none">
              North
            </h1>
            {/* Crane on top of the text */}
            <motion.div
              className="absolute -top-6 -right-8"
              animate={{
                y: [0, -5, 0],
                rotate: [-10, -6, -10]
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            >
              <Image
                src="/crane.png"
                alt="Origami Crane"
                width={50}
                height={50}
                className="object-contain"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-[#888] text-lg max-w-2xl mx-auto mb-8"
      >
        Canada's biggest hackathon. An unforgettable weekend of
        <span className="text-amber-400"> workshops</span>,
        <span className="text-emerald-400"> activities</span>, and
        <span className="text-blue-400"> tech talks</span>.
      </motion.p>

      {/* Event Count Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        className="inline-block"
      >
        {!isLoggedIn ? (
          <div className="stats-paper px-8 py-6 rounded">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="text-blue-500" size={22} />
              <span className="font-castle text-2xl text-[#2a2a2a]">
                {publicCount} Public Events
              </span>
            </div>
            <p className="text-[#666] text-sm mb-4">
              {privateCount} more exclusive events are waiting for you!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLoginClick}
              className="paper-btn px-6 py-3 rounded mx-auto"
            >
              Unlock All Events
            </motion.button>
          </div>
        ) : (
          <div className="stats-paper px-8 py-6 rounded">
            <span className="font-castle text-2xl text-[#2a2a2a] block mb-2">
              Full Access Unlocked!
            </span>
            <p className="text-[#065f46] font-medium text-sm">
              Viewing all {publicCount + privateCount} events including {privateCount} private ones
            </p>
          </div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center text-[#555]"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <ArrowDown size={18} />
        </motion.div>
      </motion.div>
    </header>
  );
}
