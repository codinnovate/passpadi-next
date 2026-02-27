"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FeedFilterTabsProps {
  value: string;
  onChange: (value: string) => void;
}

const TABS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "question", label: "Questions" },
  { value: "marketplace", label: "Marketplace" },
  { value: "job", label: "Jobs" },
];

export default function FeedFilterTabs({ value, onChange }: FeedFilterTabsProps) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList variant="line" className="w-full justify-start">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
