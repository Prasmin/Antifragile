"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  ActivityIcon,

  GaugeIcon,
  Layers3Icon,
  NotebookPenIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description?: string;
  badge?: string;
}

const primaryNav: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: GaugeIcon,
    description: "Your daily snapshot",
  },
  {
    title: "Barbell",
    href: "/dashboard/barbell",
    icon: Layers3Icon,
    description: "Stress-test plans",
  },
  {
    title: "Journal",
    href: "/dashboard/journal",
    icon: NotebookPenIcon,
    description: "Capture field notes",
  },
  {
    title: "Via Negativa",
    href: "/dashboard/vianegativa",
    icon: ActivityIcon,
    description: "Track avoidable risks",
  },
];



interface AppSidebarProps {
  user: User | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email ??
    "Guest";
  const initials =
    displayName
      .split(" ")
      .map((chunk) => chunk.at(0))
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AF";

  const renderNavSection = (label: string, items: NavItem[]) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.description ?? item.title}
                >
                  <Link href={item.href} aria-label={item.title}>
                    <Icon className="size-4" />
                    <span>{item.title}</span>
                    {item.badge ? (
                      <span className="ml-auto rounded-full bg-white/10 px-2 text-xs uppercase tracking-wide text-white/80">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="bg-slate-900/80 text-black backdrop-blur "
      >
        <SidebarHeader className="gap-1 border-b border-white/5">
          <p className="text-xs uppercase tracking-[0.3em] text-black/60">
            Antifragile
          </p>
          <h1 className="text-lg font-semibold">Field Lab</h1>
          <p className="text-xs text-black/50">
            Learn better, think deeper, grow stronger.
          </p>
        </SidebarHeader>
        <SidebarContent>
          {renderNavSection("Tools", primaryNav)}
          <SidebarSeparator className="border-white/10" />
        
        
          
        </SidebarContent>
        <SidebarFooter className="border-t border-white/5">
          <div className="flex items-center gap-3 rounded-md bg-white/5 px-2 py-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-white/10 text-sm font-medium uppercase text-white">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-tight">
                {displayName}
              </span>
              <span className="text-xs text-white/60">
                {user?.email ?? "guest@antifragile.dev"}
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
    </>
  );
}
