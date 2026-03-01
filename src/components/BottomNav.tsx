"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarContent } from "@/components/Sidebar";
import { HomeIcon, FeedIcon, CbtIcon, CupIcon } from "@/assets/icons";

type TabIcon = React.ComponentType<{ size?: number; className?: string }>;

const tabs: { title: string; href: string; icon: TabIcon }[] = [
  { title: "Home", href: "/dashboard", icon: HomeIcon },
  { title: "Feeds", href: "/dashboard/feeds", icon: FeedIcon },
  { title: "CBT", href: "/dashboard/cbt", icon: CbtIcon },
  { title: "Board", href: "/dashboard/leaderboard", icon: CupIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur-sm dark:border-white/10 dark:bg-gray-950/95 md:hidden">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-around">
          {tabs.map((tab) => {
            const active =
              tab.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(tab.href);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-1.5 transition-colors",
                  active ? "text-app-primary" : "text-gray-500"
                )}
              >
                <Icon size={20} className="transition-colors" />
                <span
                  className={cn(
                    "text-[10px] leading-tight",
                    active ? "font-semibold" : "font-medium"
                  )}
                >
                  {tab.title}
                </span>
              </Link>
            );
          })}

          {/* More button — opens sidebar sheet */}
          <button
            onClick={() => setSheetOpen(true)}
            className="flex flex-1 flex-col items-center gap-0.5 py-1.5 text-gray-500 transition-colors"
          >
            <Menu size={20} strokeWidth={1.8} />
            <span className="text-[10px] font-medium leading-tight">More</span>
          </button>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>

      {/* Mobile sidebar sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="left"
          className="w-[280px] p-0"
          onClick={() => setSheetOpen(false)}
        >
          <SheetHeader className="border-b border-gray-100 dark:border-white/10 px-4 py-3">
            <SheetTitle className="text-base font-semibold">Menu</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
