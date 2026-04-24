"use client";

import { CheckCircle2, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdmissionCheckFormField } from "@/modules/landing-page/ui/admission-check-form-field";
import {
  type AdmissionTrackingPayload,
  trackAdmissionEvent,
} from "@/app/(landing)/premium/admission-tracking";
import {
  type AdmissionCheckFieldKey,
  type AdmissionCheckFormState,
  type AdmissionCheckStep,
  sanitizeJambScoreInput,
  sanitizeWhatsappInput,
} from "@/app/(landing)/premium/admission-check-schema";

type Props = {
  current: AdmissionCheckStep;
  form: AdmissionCheckFormState;
  onTrackEvent?: (payload: AdmissionTrackingPayload) => void;
  postUtmeStudyGroupUrl: string;
  updateField: (key: AdmissionCheckFieldKey, value: string) => void;
  whatsappChannelUrl: string;
};

export function AdmissionCheckStepContent({
  current,
  form,
  onTrackEvent = trackAdmissionEvent,
  postUtmeStudyGroupUrl,
  updateField,
  whatsappChannelUrl,
}: Props) {
  if (current.kind === "field") {
    return (
      <AdmissionCheckFormField
        autoFocus
        type={current.type}
        inputMode={current.inputMode}
        value={form[current.key]}
        onChange={(value) =>
          updateField(
            current.key,
            current.key === "phone"
              ? sanitizeWhatsappInput(value)
              : current.key === "score"
                ? sanitizeJambScoreInput(value)
                : value
          )
        }
        placeholder={current.placeholder}
        variant={
          current.multiline ? "textarea" : current.key === "phone" ? "phone" : "input"
        }
      />
    );
  }

  if (current.kind === "admission-updates") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { label: "No, continue", value: "no" },
          { label: "Yes, send me updates", value: "yes" },
        ].map((option) => {
          const isSelected = form.receiveAdmissionUpdates === option.value;
          const isYesOption = option.value === "yes";

          return (
            <Button
              key={option.value}
              type="button"
              onClick={() => updateField("receiveAdmissionUpdates", option.value)}
              className={cn(
                "h-14 justify-between rounded-none bg-white text-base font-black text-[#002769] hover:bg-white/90",
                isSelected &&
                  "bg-white text-[#002769] ring-2 ring-white/70 hover:bg-white",
                isSelected &&
                  !isYesOption &&
                  "bg-[#002769] text-white hover:bg-[#002769]"
              )}
            >
              <span>{option.label}</span>
              {isSelected && isYesOption ? (
                <CheckCircle2 className="ml-auto size-5 text-[#027937]" />
              ) : null}
            </Button>
          );
        })}
      </div>
    );
  }

  if (current.kind === "admission-channel") {
    return (
      <div className="rounded-3xl bg-white p-5 text-[#002769] shadow-xl">
        <p className="text-lg font-black">Here is the link</p>
        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Join our Admission Updates channel for information about your school,
          screening dates, admission lists, Post-UTME updates, and deadline changes.
        </p>
        <a
          href={whatsappChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
          onClick={() =>
            onTrackEvent({
              eventName: "join_admission_updates_clicked",
              stepIndex: 5,
              stepKey: "admission_channel",
              stepTitle: "Here is the Admission Updates channel link",
            })
          }
        >
          <Button
            type="button"
            className="mt-4 h-11 rounded-none bg-green-600 px-5 font-bold text-white hover:bg-green-700"
          >
            Join Admission Updates
            <ExternalLink className="size-4" />
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { label: "No / Not sure yet", value: "no" },
          { label: "Yes, I will", value: "yes" },
        ].map((option) => (
          <Button
            key={option.value}
            type="button"
            onClick={() => updateField("writingPostUtme", option.value)}
            className={cn(
              "h-14 rounded-2xl bg-white text-base font-black text-[#002769] hover:bg-white/90",
              form.writingPostUtme === option.value &&
                "bg-[#002769] text-white ring-2 ring-white/50 hover:bg-[#002769]"
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {form.writingPostUtme === "yes" ? (
        <div className="rounded-3xl bg-white p-5 text-[#002769] shadow-xl">
          <p className="text-lg font-black">Join our Post-UTME study group</p>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Study with other candidates, get preparation reminders, and stay ready
            while we review your admission chances.
          </p>
          <a
            href={postUtmeStudyGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              onTrackEvent({
                eventName: "join_post_utme_group_clicked",
                stepIndex: 9,
                stepKey: "post_utme_question",
                stepTitle: "Will you be writing Post-UTME?",
              })
            }
          >
            <Button
              type="button"
              className="mt-4 h-11 rounded-none bg-green-500 px-5 font-bold text-white hover:bg-green-600"
            >
              Join Post-UTME Group
              <ExternalLink className="size-4" />
            </Button>
          </a>
        </div>
      ) : null}
    </div>
  );
}
