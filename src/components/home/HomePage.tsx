"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useRecordDailyActivityMutation } from "@/store/api";

import WelcomeSection from "./WelcomeSection";
import ActivityStreak from "./ActivityStreak";
import AIStudyRecommendation from "./AIStudyRecommendation";
import XPStreakCard from "./XPStreakCard";
import RecentFeedPosts from "./RecentFeedPosts";
import LatestBlogArticles from "./LatestBlogArticles";
import StudyGroupsPreview from "./StudyGroupsPreview";
import LeaderboardPreview from "./LeaderboardPreview";
import AIChatTrigger from "./AIChatTrigger";
import GuestHero from "./GuestHero";

export default function HomePage() {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [recordActivity] = useRecordDailyActivityMutation();

  useEffect(() => {
    if (isAuthenticated) {
      recordActivity(undefined);
    }
  }, [isAuthenticated, recordActivity]);

  if (!isAuthenticated) {
    return <GuestHero />;
  }

  return (
    <div className="flex flex-col gap-6">
      <WelcomeSection userName={user?.personal_info?.fullname || user?.fullname} />

      {/* XP card — mobile only (shown above the grid) */}
      <div className="md:hidden">
        <XPStreakCard />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6">
        {/* Main content */}
        <div className="flex flex-col gap-6 min-w-0">
          <ActivityStreak />
          <AIStudyRecommendation />
          <RecentFeedPosts currentUserId={user?._id} />

          {/* Leaderboard — mobile only (between sections) */}
          <div className="md:hidden">
            <LeaderboardPreview />
          </div>

          <LatestBlogArticles />
          <StudyGroupsPreview />

          {/* AI Chat — mobile only */}
          <div className="md:hidden">
            <AIChatTrigger />
          </div>
        </div>

        {/* Right sidebar — desktop only */}
        <aside className="hidden md:flex flex-col gap-6 sticky top-20 self-start">
          <XPStreakCard />
          <LeaderboardPreview />
          <AIChatTrigger />
        </aside>
      </div>
    </div>
  );
}
