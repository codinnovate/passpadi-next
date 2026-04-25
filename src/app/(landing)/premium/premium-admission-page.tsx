"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Clock3,
  GraduationCap,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { persistPremiumLandingSession, trackAdmissionEvent } from "./admission-tracking";
import { AdmissionCheckTypeform } from "./admission-check-typeform";

const stats = [
  { value: "24/7", label: "admission updates" },
  { value: "1:1", label: "expert chat support" },
  { value: "₦1,000", label: "logistics fee" },
];

const benefits = [
  "Personal review of your JAMB score, preferred course and school choice.",
  "Realistic admission chance guidance, not fear-based guesswork.",
  "Suggestions for safer alternatives if your first choice is too competitive.",
  "Admission updates, deadlines and school-specific information in WhatsApp.",
];

const benefitStyles = [
  "bg-[#f5f7fb] text-[#002769]",
  "bg-[#f5f7fb] text-[#002769]",
  "bg-[#f5f7fb] text-[#002769]",
  "bg-[#f5f7fb] text-[#002769]",
];

const stepStyles = [
  {
    card: "bg-white",
    icon: "bg-[#002769] text-white",
    number: "text-[#002769]/8",
  },
  {
    card: "bg-white",
    icon: "bg-[#002769] text-white",
    number: "text-[#002769]/8",
  },
  {
    card: "bg-white",
    icon: "bg-[#002769] text-white",
    number: "text-[#002769]/8",
  },
];

const steps = [
  {
    title: "Enter your score and choices",
    description:
      "Submit your JAMB score, intended course, preferred school and key details.",
  },
  {
    title: "Get your admission review",
    description:
      "Our team reviews your profile and gives a realistic estimate of your admission chances.",
  },
  {
    title: "Receive guidance and updates",
    description:
      "Get practical next steps, safer alternatives and important admission deadline alerts.",
  },
];

const testimonials = [
  {
    name: "Favour A.",
    course: "Medicine aspirant",
    quote:
      "I thought my score had ended everything. The advice helped me change my plan early and pick a stronger option.",
  },
  {
    name: "Daniel O.",
    course: "Engineering aspirant",
    quote:
      "The experts explained my school cut-off, Post-UTME target and backup schools in a way I could act on immediately.",
  },
  {
    name: "Aisha M.",
    course: "Law aspirant",
    quote:
      "The WhatsApp updates saved me from missing my screening timeline. It felt like someone was watching the process with me.",
  },
];

const generateSlotsLeft = () => Math.floor(Math.random() * 41) + 15;

export default function PremiumAdmissionPage() {
  const [admissionCheckOpen, setAdmissionCheckOpen] = useState(false);
  const [slotsLeft, setSlotsLeft] = useState<number | null>(null);
  const [slotsAnimating, setSlotsAnimating] = useState(false);

  const openAdmissionCheck = (eventName: string) => {
    trackAdmissionEvent({ eventName });
    setAdmissionCheckOpen(true);
  };

  useEffect(() => {
    trackAdmissionEvent({
      eventName: "premium_page_viewed",
      metadata: {
        path: window.location.pathname,
      },
    });
    persistPremiumLandingSession();

    const startingSlots = generateSlotsLeft();
    const finalSlots = startingSlots - 5;
    let interval: number | undefined;

    setSlotsLeft(startingSlots);

    const startTimer = window.setTimeout(() => {
      setSlotsAnimating(true);

      interval = window.setInterval(() => {
        setSlotsLeft((currentSlots) => {
          if (!currentSlots) {
            return finalSlots;
          }

          const nextSlots = currentSlots - 1;

          if (nextSlots <= finalSlots) {
            if (interval) {
              window.clearInterval(interval);
            }
            setSlotsAnimating(false);
            return finalSlots;
          }

          return nextSlots;
        });
      }, 450);
    }, 700);

    return () => {
      window.clearTimeout(startTimer);
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fafc] text-app-secondary">
      <section className="relative isolate overflow-hidden bg-[#002769] text-white">

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.02fr_0.98fr] md:items-center md:py-20 lg:gap-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
              <Sparkles className="size-3.5" />
              2026 admission chances review
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.04] tracking-[-0.04em] text-white md:text-6xl">
              Share your 2026 JAMB Score, Course and School to Know your
              <span className="block text-white">Admission Chances</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/72 md:text-lg">
              Your JAMB score is not the end. Let experienced admission
              advisers review your score, course and preferred school, then
              tell you the next best move before deadlines start rushing you.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={() => openAdmissionCheck("check_my_chances_clicked")}
                className="h-12 w-full rounded-full bg-[#027937] px-6 text-base font-bold text-white shadow-lg shadow-black/10 hover:bg-[#026b31] sm:w-auto"
              >
                <span>Check my chances</span>
                {slotsLeft ? (
                  <span
                    className={cn(
                      "rounded-full bg-white/16 px-2.5 py-1 text-xs font-black transition-all duration-300",
                      slotsAnimating && "scale-105 bg-white/24"
                    )}
                  >
                    {slotsLeft} Slots left
                  </span>
                ) : null}
                <ArrowRight className="size-4" />
              </Button>
              <a
                href="#testimonials"
                onClick={() =>
                  trackAdmissionEvent({ eventName: "see_student_stories_clicked" })
                }
              >
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-full bg-white px-6 text-base font-bold text-[#002769] hover:bg-white/90 sm:w-auto"
                >
                  See student stories
                </Button>
              </a>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/10 p-4 shadow-sm"
                >
                  <div className="text-lg font-black text-white md:text-2xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-medium leading-5 text-white/58">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="admission-check" className="relative">
            <div className="rounded-[2rem] bg-white p-4 shadow-2xl shadow-black/20 md:p-6">
              <div className="rounded-[1.5rem] bg-white p-5 text-[#002769] md:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#027937]">
                      Admission check
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      Know your real chances
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-[#002769] p-3">
                    <GraduationCap className="size-7 text-white" />
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  <p className="text-base leading-7 text-neutral-500">
                    Answer a few quick questions one at a time. We’ll collect your
                    score, course, school, and contact details, then open secure
                    Paystack payment for the ₦1,000 logistics fee.
                  </p>
                  <div className="relative grid gap-3 text-sm font-semibold text-[#002769] sm:grid-cols-3">
                    <div className="absolute left-6 top-6 hidden h-px w-[calc(100%-3rem)] bg-[#002769]/10 sm:block" />
                    <div className="relative rounded-2xl bg-[#f5f7fb] p-4">
                      <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-[#002769] text-white shadow-sm">
                        <Trophy className="size-5" />
                      </div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#027937]">
                        Step 01
                      </p>
                      <p className="mt-1 text-base font-black">JAMB Score</p>
                    </div>
                    <div className="relative rounded-2xl bg-[#f5f7fb] p-4">
                      <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-[#002769] text-white shadow-sm">
                        <BookOpenCheck className="size-5" />
                      </div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#027937]">
                        Step 02
                      </p>
                      <p className="mt-1 text-base font-black">Course</p>
                    </div>
                    <div className="relative rounded-2xl bg-[#f5f7fb] p-4">
                      <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-[#002769] text-white shadow-sm">
                        <GraduationCap className="size-5" />
                      </div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#027937]">
                        Step 03
                      </p>
                      <p className="mt-1 text-base font-black">School</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => openAdmissionCheck("start_admission_check_clicked")}
                    className="h-12 w-full rounded-2xl bg-[#027937] text-base font-black text-white hover:bg-[#026b31]"
                  >
                    <span>Start admission check</span>
                    {slotsLeft ? (
                      <span
                        className={cn(
                          "rounded-full bg-white/16 px-2.5 py-1 text-xs font-black transition-all duration-300",
                          slotsAnimating && "scale-105 bg-white/24"
                        )}
                      >
                        {slotsLeft} Slots left
                      </span>
                    ) : null}
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-xs leading-5 text-white/65">
              Disclaimer: 90percent provides admission guidance only. We do not
              guarantee admission, change JAMB scores, influence JAMB, or secure
              admission from any school.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#002769]">
              What you get
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] md:text-5xl">
              Stop guessing. Talk to people who understand admission.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-gray-500">
              The goal is simple: help you know where you stand, what to change,
              and what to do next before post-UTME and screening windows open.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div
                key={benefit}
                className={cn(
                  "rounded-3xl p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg",
                  benefitStyles[index]
                )}
              >
                <BadgeCheck className="size-6" />
                <p className="mt-4 text-sm font-bold leading-7">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#002769]">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] md:text-5xl">
              Three clear steps to understand your admission chances.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => {
              const style = stepStyles[index] ?? stepStyles[0]!;

              return (
                <div
                  key={step.title}
                  className={cn(
                    "relative overflow-hidden rounded-[2rem] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl",
                    style.card
                  )}
                >
                  <div className={cn("absolute right-5 top-4 text-6xl font-black", style.number)}>
                    {index + 1}
                  </div>
                  <div className={cn("flex size-12 items-center justify-center rounded-2xl", style.icon)}>
                    {index === 0 ? (
                      <UsersRound className="size-6" />
                    ) : index === 1 ? (
                      <MessageCircle className="size-6" />
                    ) : (
                      <ShieldCheck className="size-6" />
                    )}
                  </div>
                  <h3 className="mt-5 text-xl font-black">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        className="bg-[#027937] px-4 py-16 text-white"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-white/60">
                Testimonials
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.03em] md:text-5xl">
                Students want clarity, not panic.
              </h2>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-bold text-white">
              <Clock3 className="size-4" />
              Limited expert slots per day
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-[2rem] bg-white/10 p-6 shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:bg-white/14"
              >
                <div className="flex gap-1 text-white">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-5 text-sm leading-7 text-white/75">
                  “{testimonial.quote}”
                </p>
                <div className="mt-6">
                  <p className="font-black">{testimonial.name}</p>
                  <p className="mt-1 text-sm text-white/45">
                    {testimonial.course}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="payment" className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-[#f8fafc] p-6 text-center shadow-xl md:p-10">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#027937]">
              Logistics fee: ₦1,000
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black tracking-[-0.03em] md:text-5xl">
              Get your admission chances reviewed by experts.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-500">
              Pay once for access to real-time admission conversations, school
              guidance and updates that help you make smarter choices.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={() => openAdmissionCheck("start_with_my_score_clicked")}
                className="h-12 w-full rounded-full bg-[#027937] px-6 text-base font-black text-white shadow-lg shadow-black/10 hover:bg-[#026b31] sm:w-auto"
              >
                Start with my score
                <ArrowRight className="size-4" />
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-full px-6 text-base font-black sm:w-auto"
                >
                  Learn about 90percent
                </Button>
              </Link>
            </div>
        </div>
      </section>
      <AdmissionCheckTypeform
        open={admissionCheckOpen}
        onClose={() => setAdmissionCheckOpen(false)}
      />
    </div>
  );
}
