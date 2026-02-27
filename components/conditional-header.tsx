'use client';

import { usePathname } from 'next/navigation';
import Header from './header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show header on dashboard and login pages
  if (pathname?.startsWith('/dashboard') || pathname === '/login') {
    return null;
  }
  
  return <Header />;
}
