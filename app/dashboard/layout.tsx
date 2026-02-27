'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { Home, Hotel, UtensilsCrossed, Calendar, Settings, BarChart3, LogOut, FileText, Image as ImageIcon, Images, MessageSquare, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Loader2 } from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/dashboard',
  },
  {
    title: 'Banners',
    icon: ImageIcon,
    href: '/dashboard/banners',
  },
  {
    title: 'Rooms',
    icon: Hotel,
    href: '/dashboard/rooms',
  },
  {
    title: 'Restaurants',
    icon: UtensilsCrossed,
    href: '/dashboard/restaurants',
  },
  {
    title: 'Bookings',
    icon: Calendar,
    href: '/dashboard/bookings',
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    href: '/dashboard/analytics',
  },
  {
    title: 'Blog',
    icon: FileText,
    href: '/dashboard/blog',
  },
  {
    title: 'Banquet Gallery',
    icon: Images,
    href: '/dashboard/banquet-gallery',
  },
  {
    title: 'Testimonials',
    icon: MessageSquare,
    href: '/dashboard/testimonials',
  },
  {
    title: 'Proposals',
    icon: FileCheck,
    href: '/dashboard/proposals',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Hotel className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Myriad Admin</h2>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
          <div className="p-4 border-t space-y-2">
            <SidebarMenuButton onClick={handleLogout} className="w-full text-destructive hover:text-destructive">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </SidebarMenuButton>
            <SidebarMenuButton asChild>
              <Link href="/" className="text-foreground">
                <span>Back to Website</span>
              </Link>
            </SidebarMenuButton>
          </div>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
