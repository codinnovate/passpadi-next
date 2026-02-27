"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Logo from "./Logo";
import {
  SearchNormal1,
  Notification,
  Sun1,
  Moon,
  ArrowRight,
} from "iconsax-reactjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import NotificationsModal from "./NotificationsModal";
import { useGetNotificationsQuery } from "@/store/api";

const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      setSearchOpen(false);
    }
  };
  const { resolvedTheme, setTheme } = useTheme();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: notifData } = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const unreadCount = notifData?.data?.filter((n) => n.status === "pending").length ?? 0;

  const fullname = user?.personal_info?.fullname || user?.fullname || "";
  const initials = fullname
    ? fullname
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm dark:border-white/10 dark:bg-gray-950/95">
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-3 px-4">
          {/* Logo */}
          <div className="shrink-0">
            <Logo className="w-[90px]" />
          </div>

          {/* Desktop Search Bar — only when logged in */}
          {isAuthenticated && (
            <form onSubmit={handleSearch} className="hidden flex-1 md:flex md:max-w-md lg:max-w-lg">
              <div className="relative w-full">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                  <SearchNormal1 size={18} />
                </span>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, study hacks, questions..."
                  className="pl-12 h-10 bg-[#F5F5F7] border-none rounded-xl text-sm focus-visible:ring-app-primary dark:bg-white/10"
                />
              </div>
            </form>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            {isAuthenticated && (
              <>
                {/* Mobile Search Toggle */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="rounded-full p-2 text-app-secondary dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-white/10 md:hidden"
                  aria-label="Search"
                >
                  <SearchNormal1 size={20} />
                </button>
              </>
            )}

            {/* Dark Mode Toggle — always visible */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="rounded-full p-2 text-app-secondary dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
              aria-label="Toggle dark mode"
            >
              {resolvedTheme === "dark" ? <Sun1 size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <button
                  onClick={() => setNotificationsOpen(true)}
                  className="relative rounded-full p-2 text-app-secondary dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
                  aria-label="Notifications"
                >
                  <Notification size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-app-primary ring-2 ring-white dark:ring-gray-950" />
                  )}
                </button>

                {/* User Avatar */}
                <Link href="/profile">
                  <Avatar className="size-8 ring-2 ring-gray-100 transition-all hover:ring-app-primary/30 dark:ring-white/10">
                    <AvatarImage
                      src={user?.personal_info?.profile_img || `https://api.dicebear.com/9.x/initials/svg?seed=${initials}`}
                      alt={fullname || "User"}
                    />
                    <AvatarFallback className="bg-app-primary text-xs text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </>
            ) : (
              /* Login Button — modern gradient style */
              <Link
                href="/login"
                className="group relative ml-1 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-app-primary to-blue-600 px-5 py-2 text-sm font-medium text-white shadow-md shadow-app-primary/25 transition-all duration-200 hover:shadow-lg hover:shadow-app-primary/30 hover:brightness-110 active:scale-[0.97]"
              >
                Get Started
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar (expandable) — only when logged in */}
        {isAuthenticated && searchOpen && (
          <form onSubmit={handleSearch} className="border-t border-gray-100 px-4 py-2 dark:border-white/10 md:hidden">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                <SearchNormal1 size={18} />
              </span>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, study hacks..."
                autoFocus
                className="pl-12 h-10 bg-[#F5F5F7] border-none rounded-xl text-sm focus-visible:ring-app-primary dark:bg-white/10"
              />
            </div>
          </form>
        )}
      </header>

      {/* Notifications Modal */}
      <NotificationsModal
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
    </>
  );
};

export default Header;
