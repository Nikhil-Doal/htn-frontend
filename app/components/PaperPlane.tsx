"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function PaperPlane() {
  const { scrollY } = useScroll();
  const x = useTransform(scrollY, [0, 2000], [-50, 2000]);
  const y = useTransform(scrollY, [0, 2000], [100, 1200]);
  const rotate = useTransform(scrollY, [0, 500, 1000, 1500, 2000], [10, 15, 12, 18, 14]);
  // const opacity = useTransform(scrollY, [0, 1500, 2000], [1, 0.8, 0]);
  const opacity = 1; // Keep it fully visible for a stronger presence

  const [oscillation, setOscillation] = useState(0);

  useEffect(() => {
    let time = 0;
    const animate = () => {
      time += 0.03;
      setOscillation(Math.sin(time) * 15);
      return requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <motion.div className="paper-plane-container" style={{ x, y, rotate, opacity }}>
      <motion.div animate={{ y: oscillation }} transition={{ type: "spring", stiffness: 100 }}>
        <Image
          src="/white-paper-plane.png"
          alt=""
          width={350}
          height={350}
          priority
          style={{ filter: "drop-shadow(8px 8px 16px rgba(0,0,0,0.5))" }}
        />
      </motion.div>
    </motion.div>
  );
}
