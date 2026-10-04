import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

export interface AnimatedCounterProps {
  end: number;
  start?: number;
  duration?: number; // ms
  delay?: number; // ms
  suffix?: string;
  prefix?: string;
  className?: string;
  useGrouping?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  start = 0,
  duration = 2000,
  delay = 350,
  suffix = '',
  prefix = '',
  className = '',
  useGrouping = false,
}) => {
  const [count, setCount] = useState<number>(start);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const hasAnimatedRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isInView || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    // Ease-out expo: fast start, buttery-smooth deceleration into final number
    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    let startTime: number | null = null;

    const timer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentVal = Math.round(start + (end - start) * easeOutExpo(progress));

        setCount(currentVal);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };

      rafRef.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isInView, start, end, duration, delay]);

  const formatted = useGrouping
    ? count.toLocaleString('id-ID')
    : count.toString();

  return (
    <span ref={ref} className={`tabular-nums inline-block ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
