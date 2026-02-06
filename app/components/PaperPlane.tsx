"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function PaperPlane() {
  const [windowHeight, setWindowHeight] = useState(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Transform scroll position into movement
  // Plane flies from top-left to bottom-right (southeast)
  const x = useTransform(scrollY, [0, 2000], [-50, 800]);
  const y = useTransform(scrollY, [0, 2000], [100, 1200]);
  const rotate = useTransform(scrollY, [0, 500, 1000, 1500, 2000], [10, 15, 12, 18, 14]);
  const opacity = useTransform(scrollY, [0, 1500, 2000], [1, 0.8, 0]);

  // Add a slight sine wave motion for realism
  const [oscillation, setOscillation] = useState(0);

  useEffect(() => {
    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.03;
      setOscillation(Math.sin(time) * 15);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <motion.div
      className="paper-plane-container"
      style={{
        x,
        y,
        rotate,
        opacity,
      }}
    >
      <motion.div
        animate={{ y: oscillation }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <Image
          src="/white-paper-plane.png"
          alt=""
          width={350}
          height={350}
          className="object-contain"
          priority
          style={{
            filter: "drop-shadow(8px 8px 16px rgba(0,0,0,0.5))",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
