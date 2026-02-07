"use client";

import { Github, Twitter, Instagram, Linkedin, Youtube, Facebook } from "lucide-react";

export default function Footer() {
  const socials = [
    { icon: <Github size={22} />, href: "https://github.com/hacktheNorth", label: "GitHub" },
    { icon: <Twitter size={22} />, href: "https://twitter.com/hackthenorth", label: "Twitter" },
    { icon: <Instagram size={22} />, href: "https://instagram.com/hackthenorth", label: "Instagram" },
    { icon: <Linkedin size={22} />, href: "https://linkedin.com/company/hack-the-north", label: "LinkedIn" },
    { icon: <Youtube size={22} />, href: "https://youtube.com/@hackthenorth", label: "YouTube" },
    { icon: <Facebook size={22} />, href: "https://facebook.com/hackthenorth", label: "Facebook" },
  ];

  return (
    <footer className="py-12 border-t border-[#222] mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-castle paper-gradient-text text-xl">
              Hack the North 2026
            </span>
            <p className="text-[#666] text-sm mt-1">Made with paper and code</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://hackthenorth.com"
              target="_blank"
              rel="noopener noreferrer"
              className="paper-btn px-4 py-2 rounded text-sm"
            >
              Official Site
            </a>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#888] hover:text-[#f5f0e6] transition-colors"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="text-center mt-8 pt-8 border-t border-[#222]">
          <p className="text-[#666] text-sm">Frontend Challenge Submission</p>
        </div>
      </div>
    </footer>
  );
}
