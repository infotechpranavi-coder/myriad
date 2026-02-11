'use client';

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { Home, Hotel, UtensilsCrossed, Calendar, Settings, BarChart3, LogOut, FileText, Image as ImageIcon, Images } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
          <div className="p-4 border-t">
            <SidebarMenuButton asChild>
              <Link href="/" className="text-destructive">
                <LogOut className="w-4 h-4" />
                <span>Back to Website</span>
              </Link>
            </SidebarMenuButton>
          </div>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="border-b p-4 flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
