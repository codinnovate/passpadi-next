"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronUp,
  Atom,
  BookOpenText,
  FlaskConical,
  Dna,
  TrendingUp,
  Landmark,
  PenLine,
  Calculator,
  Globe,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  FeedIcon,
  CbtIcon,
  CupIcon,
  PeopleIcon,
  StudyPartnerIcon,
  EventsIcon,
} from "@/assets/icons";

type NavIcon = React.ComponentType<{ size?: number; className?: string }>;

const mainNav: { title: string; href: string; icon: NavIcon }[] = [
  { title: "Home", href: "/", icon: HomeIcon },
  { title: "Feeds", href: "/feeds", icon: FeedIcon },
  { title: "Blog", href: "/blog", icon: Newspaper },
  { title: "CBT", href: "/cbt", icon: CbtIcon },
  { title: "Leaderboard", href: "/leaderboard", icon: CupIcon },
];

const groupsNav: { title: string; href: string; icon: NavIcon }[] = [
  { title: "Study Groups", href: "/study-groups", icon: PeopleIcon },
  { title: "Find Study Partner", href: "/feeds", icon: StudyPartnerIcon },
  { title: "Events", href: "/feeds", icon: EventsIcon },
];

const subjectsNav: { title: string; href: string; icon: NavIcon }[] = [
  { title: "Mathematics", href: "/subject/mathematics", icon: Calculator },
  { title: "English", href: "/subject/english", icon: PenLine },
  { title: "Physics", href: "/subject/physics", icon: Atom },
  { title: "Chemistry", href: "/subject/chemistry", icon: FlaskConical },
  { title: "Biology", href: "/subject/biology", icon: Dna },
  { title: "Economics", href: "/subject/economics", icon: TrendingUp },
  { title: "Government", href: "/subject/government", icon: Landmark },
  { title: "Literature", href: "/subject/literature", icon: BookOpenText },
  { title: "General Paper", href: "/subject/general-paper", icon: Globe },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavItem({
  item,
  pathname,
}: {
  item: { title: string; href: string; icon: NavIcon };
  pathname: string;
}) {
  const active = isActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
        active
          ? "text-app-primary"
          : "text-gray-500 hover:bg-[#F5F5F7] hover:text-app-secondary dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
      )}
    >
      <Icon
        size={18}
        className={cn("shrink-0", active ? "text-app-primary" : "text-gray-500 dark:text-gray-400")}
      />
      <span>{item.title}</span>
    </Link>
  );
}

function CollapsibleSection({
  title,
  items,
  pathname,
  defaultOpen = true,
}: {
  title: string;
  items: { title: string; href: string; icon: NavIcon }[];
  pathname: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-2"
      >
        <span className="text-[13px] font-semibold text-app-secondary dark:text-white">
          {title}
        </span>
        <ChevronUp
          size={16}
          className={cn(
            "text-gray-500 transition-transform",
            !open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-0.5">
          {items.map((item) => (
            <NavItem key={item.title} item={item} pathname={pathname} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-2 py-3 overflow-y-auto">
      {/* Main navigation */}
      <div className="flex flex-col gap-0.5">
        {mainNav.map((item) => (
          <NavItem key={item.href} item={item} pathname={pathname} />
        ))}
      </div>

      <div className="mx-3 my-2 h-px bg-gray-100 dark:bg-white/10" />

      {/* Groups */}
      <CollapsibleSection title="Groups" items={groupsNav} pathname={pathname} />

      <div className="mx-3 my-2 h-px bg-gray-100 dark:bg-white/10" />

      {/* Study Subjects */}
      <CollapsibleSection
        title="Study Subjects"
        items={subjectsNav}
        pathname={pathname}
      />
    </nav>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden md:flex sticky top-14 h-[calc(100vh-3.5rem)] w-[230px] shrink-0 flex-col border-r border-gray-100 bg-white dark:border-white/10 dark:bg-gray-950 overflow-y-auto">
      <SidebarContent />
    </aside>
  );
}
