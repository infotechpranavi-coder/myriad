'use client';

import { ReactNode } from 'react';
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation';

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  animation?: 'fadeUp' | 'fadeDown' | 'slideInLeft' | 'slideInRight' | 'scaleIn';
  delay?: number;
  className?: string;
}

export function ScrollAnimationWrapper({
  children,
  animation = 'fadeUp',
  delay = 0,
  className = '',
}: ScrollAnimationWrapperProps) {
  const { ref, isVisible } = useIntersectionAnimation();

  const animationClass = `animate-${animation}`;
  const delayClass = delay > 0 ? `animate-delay-${delay}` : '';

  return (
    <div
      ref={ref as any}
      className={`${isVisible ? `${animationClass} ${delayClass}` : 'opacity-0'} transition-all ${className}`}
    >
      {children}
    </div>
  );
}
