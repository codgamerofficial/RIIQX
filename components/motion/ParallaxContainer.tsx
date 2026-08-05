'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // 1 to 5 depth factor
  mouseDriven?: boolean;
}

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  className,
  speed = 2,
  mouseDriven = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scrollY = useTransform(scrollYProgress, [0, 1], [-speed * 20, speed * 20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseDriven || !containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) / (width / 2);
    const y = (e.clientY - (top + height / 2)) / (height / 2);
    setMouseOffset({ x: x * speed * 8, y: y * speed * 8 });
  };

  const handleMouseLeave = () => {
    if (mouseDriven) {
      setMouseOffset({ x: 0, y: 0 });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('relative overflow-hidden', className)}
    >
      <motion.div
        style={{ y: scrollY }}
        animate={mouseDriven ? { x: mouseOffset.x, y: mouseOffset.y } : undefined}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};
