"use client";

import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AppStoreButtons from "@/modules/landing-page/ui/appstores";
import {
  type AdmissionCheckFieldKey,
  type AdmissionCheckFormState,
  sanitizeJambScoreInput,
  sanitizeWhatsappInput,
} from "@/app/(landing)/premium/admission-check-schema";

type Props = {
  form: AdmissionCheckFormState;
  isUpdatingLead: boolean;
  onClose: () => void;
  onUpdateDetails: () => void;
  updateError: string;
  updateField: (key: AdmissionCheckFieldKey, value: string) => void;
  updateSuccess: string;
};

const fieldClassName =
  "h-11 rounded-none border border-[#002769]/12 bg-white px-3 text-sm font-semibold text-[#002769]";

export function AdmissionPaymentSuccessModal({
  form,
  isUpdatingLead,
  onClose,
  onUpdateDetails,
  updateError,
  updateField,
  updateSuccess,
}: Props) {
  const details = [
    ["Name", form.name],
    ["Email", form.email],
    ["WhatsApp", form.phone],
    ["JAMB score", form.score],
    ["Course", form.course],
    ["School", form.school],
    ["Admission updates", form.receiveAdmissionUpdates || "-"],
    ["Post-UTME", form.writingPostUtme || "-"],
  ];

  return (
    <div className="fixed inset-0 z-150 overflow-y-auto bg-black/70 px-4 py-6">
      <div className="mx-auto w-full max-w-3xl bg-white p-5 text-[#002769] shadow-2xl md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#027937]">
              Payment successful
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] md:text-4xl">
              We have received your information.
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Our admission team will reach out. Please make sure your phone and
              details are correct. If anything is wrong, update it here. You will
              not pay again.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center bg-[#002769]/8 text-[#002769] hover:bg-[#002769]/12"
            aria-label="Close payment success modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-[#f5f7fb] p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#002769]/55">
            Submitted details
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {details.map(([label, value]) => (
              <span
                key={label}
                className="bg-white px-3 py-2 text-xs font-bold text-[#002769]"
              >
                {label}: {value || "-"}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <Input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Full name"
            className={fieldClassName}
          />
          <Input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="Email"
            className={fieldClassName}
          />
          <Input
            value={form.phone}
            onChange={(event) =>
              updateField("phone", sanitizeWhatsappInput(event.target.value))
            }
            placeholder="WhatsApp number"
            className={fieldClassName}
          />
          <Input
            inputMode="numeric"
            value={form.score}
            onChange={(event) =>
              updateField("score", sanitizeJambScoreInput(event.target.value))
            }
            placeholder="JAMB score"
            className={fieldClassName}
          />
          <Input
            value={form.course}
            onChange={(event) => updateField("course", event.target.value)}
            placeholder="Course"
            className={fieldClassName}
          />
          <Input
            value={form.school}
            onChange={(event) => updateField("school", event.target.value)}
            placeholder="School"
            className={fieldClassName}
          />
          <Textarea
            value={form.note}
            onChange={(event) => updateField("note", event.target.value)}
            placeholder="Extra note"
            className="min-h-24 rounded-none border border-[#002769]/12 bg-white px-3 py-3 text-sm font-semibold text-[#002769] md:col-span-2"
          />
        </div>

        {updateError ? (
          <p className="mt-3 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
            {updateError}
          </p>
        ) : null}
        {updateSuccess ? (
          <p className="mt-3 bg-green-50 px-3 py-2 text-sm font-semibold text-[#027937]">
            {updateSuccess}
          </p>
        ) : null}

        <div className="mt-5 rounded-2xl bg-[#002769] p-4 text-white">
          <p className="text-lg font-black">
            Writing Post-UTME? Download the 90percent app for free.
          </p>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Practice past questions, prepare faster, and keep improving while our
            team reviews your admission chances.
          </p>
          <div className="mt-4">
            <AppStoreButtons />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-11 rounded-none bg-white px-5 font-black text-[#002769] hover:bg-white"
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={onUpdateDetails}
            disabled={isUpdatingLead}
            className="h-11 rounded-none bg-[#027937] px-5 font-black text-white hover:bg-[#026b31]"
          >
            {isUpdatingLead ? <Loader2 className="size-4 animate-spin" /> : null}
            Save updated details
          </Button>
        </div>
      </div>
    </div>
  );
}
