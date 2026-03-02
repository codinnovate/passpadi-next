import Hero from "@/modules/landing-page/view/hero";
import Features from "@/modules/landing-page/view/features";

export const metadata = {
  title: "90Percent — Pass JAMB & Post-UTME in One Go",
  description:
    "Practice CBT past questions, join study groups, and get AI-powered study recommendations. Everything you need to ace JAMB, WAEC, NECO, and Post-UTME.",
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
    </>
  );
}
