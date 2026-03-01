"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Sparkles,
  Trophy,
  Radio,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type EventStatus = "upcoming" | "in-progress" | "completed";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  status: EventStatus;
  category: string;
  image: string;
}

const events: Event[] = [
  {
    id: "1",
    title: "JAMB Mathematics Crash Course",
    description:
      "Intensive revision covering algebra, calculus, and statistics for JAMB preparation.",
    date: "Mar 15, 2026",
    time: "10:00 AM — 1:00 PM",
    location: "Virtual (Google Meet)",
    attendees: 87,
    maxAttendees: 150,
    status: "upcoming",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=600&h=340&fit=crop",
  },
  {
    id: "2",
    title: "English Language Essay Writing Masterclass",
    description:
      "Learn essay structuring, grammar hacks, and scoring techniques from top WAEC examiners.",
    date: "Mar 10, 2026",
    time: "2:00 PM — 4:30 PM",
    location: "Virtual (Zoom)",
    attendees: 64,
    maxAttendees: 100,
    status: "upcoming",
    category: "Masterclass",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=340&fit=crop",
  },
  {
    id: "3",
    title: "Physics Problem-Solving Sprint",
    description:
      "Live problem-solving session tackling past WAEC and JAMB physics questions in real time.",
    date: "Mar 1, 2026",
    time: "11:00 AM — 2:00 PM",
    location: "Virtual (Google Meet)",
    attendees: 120,
    maxAttendees: 120,
    status: "in-progress",
    category: "Live Session",
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&h=340&fit=crop",
  },
  {
    id: "4",
    title: "Study Group Challenge: Biology Edition",
    description:
      "Compete in teams to answer biology questions. Top 3 groups win prizes and XP boosts.",
    date: "Mar 1, 2026",
    time: "4:00 PM — 6:00 PM",
    location: "In-App (Live Quiz)",
    attendees: 95,
    maxAttendees: 200,
    status: "in-progress",
    category: "Competition",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&h=340&fit=crop",
  },
  {
    id: "5",
    title: "Chemistry Revision Bootcamp",
    description:
      "A 3-hour bootcamp covering organic and inorganic chemistry with practice drills.",
    date: "Feb 22, 2026",
    time: "9:00 AM — 12:00 PM",
    location: "Virtual (Zoom)",
    attendees: 110,
    maxAttendees: 110,
    status: "completed",
    category: "Bootcamp",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=340&fit=crop",
  },
  {
    id: "6",
    title: "JAMB Mock Exam — Full CBT Simulation",
    description:
      "Full-length timed CBT mock exam across all JAMB subjects with instant scoring and review.",
    date: "Feb 15, 2026",
    time: "8:00 AM — 12:00 PM",
    location: "In-App (CBT Mode)",
    attendees: 200,
    maxAttendees: 200,
    status: "completed",
    category: "Mock Exam",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=340&fit=crop",
  },
];

const tabs: { label: string; value: EventStatus; icon: React.ReactNode }[] = [
  {
    label: "Upcoming",
    value: "upcoming",
    icon: <Calendar size={15} />,
  },
  {
    label: "In Progress",
    value: "in-progress",
    icon: <Radio size={15} />,
  },
  {
    label: "Completed",
    value: "completed",
    icon: <Trophy size={15} />,
  },
];

function statusConfig(status: EventStatus) {
  switch (status) {
    case "upcoming":
      return {
        label: "Upcoming",
        classes: "bg-app-primary/10 text-app-primary",
        dot: "bg-app-primary",
      };
    case "in-progress":
      return {
        label: "Live Now",
        classes: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
        dot: "bg-emerald-500 animate-pulse",
      };
    case "completed":
      return {
        label: "Completed",
        classes: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
        dot: "bg-gray-400",
      };
  }
}

function EventCard({ event }: { event: Event }) {
  const config = statusConfig(event.status);
  const spotsLeft = event.maxAttendees - event.attendees;
  const fillPercent = (event.attendees / event.maxAttendees) * 100;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-white/10 dark:bg-gray-950">
      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm",
              config.classes
            )}
          >
            <span className={cn("size-1.5 rounded-full", config.dot)} />
            {config.label}
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute right-3 top-3">
          <Badge
            variant="secondary"
            className="bg-white/90 text-gray-700 backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-300"
          >
            {event.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-base font-semibold leading-snug text-foreground line-clamp-2">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        {/* Details */}
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar size={13} className="shrink-0" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock size={13} className="shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin size={13} className="shrink-0" />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Attendees bar */}
        <div className="flex flex-col gap-1.5 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users size={13} />
              {event.attendees} / {event.maxAttendees} attending
            </span>
            {event.status !== "completed" && spotsLeft > 0 && (
              <span className="font-medium text-app-primary">
                {spotsLeft} spots left
              </span>
            )}
            {event.status !== "completed" && spotsLeft === 0 && (
              <span className="font-medium text-red">Sold out</span>
            )}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                event.status === "completed"
                  ? "bg-gray-300 dark:bg-gray-600"
                  : fillPercent >= 90
                    ? "bg-red"
                    : "bg-app-primary"
              )}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        {/* Action */}
        <button
          className={cn(
            "mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.98]",
            event.status === "upcoming" &&
              "bg-app-primary text-white hover:brightness-110",
            event.status === "in-progress" &&
              "bg-emerald-500 text-white hover:bg-emerald-600",
            event.status === "completed" &&
              "border border-gray-200 bg-transparent text-muted-foreground hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
          )}
        >
          {event.status === "upcoming" && (
            <>
              Register Now
              <ArrowRight size={15} />
            </>
          )}
          {event.status === "in-progress" && (
            <>
              <Sparkles size={15} />
              Join Now
            </>
          )}
          {event.status === "completed" && "View Recap"}
        </button>
      </div>
    </div>
  );
}

export default function EventsPageClient() {
  const [activeTab, setActiveTab] = useState<EventStatus>("upcoming");

  const filtered = events.filter((e) => e.status === activeTab);

  return (
    <div className="flex w-full flex-col gap-6 py-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="mt-1 text-muted-foreground">
          Join workshops, competitions, and live study sessions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {tabs.map((tab) => {
          const count = events.filter((e) => e.status === tab.value).length;
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                isActive
                  ? "border-app-primary bg-app-primary/5 text-app-primary"
                  : "border-gray-200 bg-white text-muted-foreground hover:border-gray-300 hover:text-foreground dark:border-white/10 dark:bg-gray-950 dark:hover:border-white/20"
              )}
            >
              {tab.icon}
              {tab.label}
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[11px] font-semibold",
                  isActive
                    ? "bg-app-primary text-white"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 py-16 dark:border-white/10">
          <div className="flex size-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <Calendar size={22} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            No {activeTab} events right now
          </p>
          <p className="text-xs text-muted-foreground/60">
            Check back later for new events
          </p>
        </div>
      )}
    </div>
  );
}
