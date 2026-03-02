'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface ConditionalHeaderProps {
  children: ReactNode;
}

export default function ConditionalHeader({ children }: ConditionalHeaderProps) {
  const pathname = usePathname();
  
  // Don't show header on dashboard and login pages
  if (pathname?.startsWith('/dashboard') || pathname === '/login') {
    return null;
  }
  
  return <>{children}</>;
}
