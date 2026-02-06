"use client";

import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { LogIn, LogOut, User } from "lucide-react";

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const { isLoggedIn, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-[60] bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#222]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Title */}
          <div className="flex flex-col">
            <span className="font-castle paper-gradient-text text-xl sm:text-2xl tracking-wide leading-tight">
              Hack the North
            </span>
            <span className="text-[#555] text-xs tracking-widest uppercase">
              2026 Edition
            </span>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 stats-paper rounded">
                  <User size={14} className="text-[#666]" />
                  <span className="text-sm text-[#3a3a3a] font-medium">
                    Hacker
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="paper-btn px-4 py-2 rounded flex items-center gap-2 text-sm"
                  aria-label="Logout"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLoginClick}
                className="paper-btn px-4 py-2 rounded flex items-center gap-2 text-sm"
                aria-label="Login to view all events"
              >
                <LogIn size={14} />
                <span>Hacker Login</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
