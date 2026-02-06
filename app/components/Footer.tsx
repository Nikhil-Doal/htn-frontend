"use client";

import { motion } from "framer-motion";
import { Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="py-12 border-t border-[#222] mt-16"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo and tagline */}
          <div>
            <span className="font-castle paper-gradient-text text-xl">
              Hack the North 2026
            </span>
            <p className="text-[#666] text-sm mt-1">
              Made with paper and code
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              href="https://hackthenorth.com"
              target="_blank"
              rel="noopener noreferrer"
              className="paper-btn px-4 py-2 rounded text-sm"
            >
              Official Site
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="https://github.com/hacktheNorth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#888] hover:text-[#f5f0e6] transition-colors"
              aria-label="GitHub"
            >
              <Github size={24} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="https://twitter.com/hackthenorth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#888] hover:text-[#f5f0e6] transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={24} />
            </motion.a>
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-center mt-8 pt-8 border-t border-[#222]">
          <p className="text-[#666] text-sm">
            Frontend Challenge Submission
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
