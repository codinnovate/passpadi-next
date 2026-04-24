"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdmissionCheckAfterPaymentCard } from "@/modules/landing-page/ui/admission-check-after-payment-card";
import { AdmissionPaymentSuccessModal } from "@/modules/landing-page/ui/admission-payment-success-modal";
import { AdmissionCheckStepContent } from "@/modules/landing-page/ui/admission-check-step-content";
import { trackAdmissionEvent } from "./admission-tracking";
import { useAdmissionCheckFlow } from "./use-admission-check-flow";

export function AdmissionCheckTypeform({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    canContinue,
    current,
    form,
    goBack,
    handlePayment,
    handleSubmit,
    handleUpdateLeadDetails,
    isLastStep,
    isStartingPayment,
    isSubmitting,
    isUpdatingLead,
    paymentComplete,
    paymentError,
    phoneValidationError,
    scoreValidationError,
    postUtmeStudyGroupUrl,
    progress,
    questionsLength,
    step,
    submitted,
    submitError,
    showPaymentSuccessModal,
    setShowPaymentSuccessModal,
    updateField,
    updateError,
    updateSuccess,
    whatsappChannelUrl,
    whatsappMessage,
    flushFunnelSnapshot,
  } = useAdmissionCheckFlow({ isFunnelOpen: open });

  const openedTrackedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      openedTrackedRef.current = false;
      return;
    }

    if (openedTrackedRef.current) return;
    openedTrackedRef.current = true;

    trackAdmissionEvent({ eventName: "admission_form_opened" });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleBeforeUnload = () => {
      if (submitted || paymentComplete) return;

      trackAdmissionEvent(
        {
          eventName: "admission_form_abandoned",
          stepIndex: step + 1,
          stepKey: current.kind === "field" ? current.key : current.kind,
          stepTitle: current.title,
          metadata: {
            submitted,
            paymentComplete,
          },
        },
        { beacon: true }
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [current, open, paymentComplete, step, submitted]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto bg-[#002769] text-white">
      <div className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between px-4 py-4 md:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/55">
              Admission check
            </p>
            <p className="mt-1 text-sm font-semibold text-white/80">
              Question {step + 1} of {questionsLength}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              trackAdmissionEvent({
                eventName: "admission_form_closed",
                stepIndex: step + 1,
                stepKey: current.kind === "field" ? current.key : current.kind,
                stepTitle: current.title,
                metadata: {
                  submitted,
                  paymentComplete,
                },
              });
              if (!submitted) {
                flushFunnelSnapshot();
                trackAdmissionEvent({
                  eventName: "admission_form_abandoned",
                  stepIndex: step + 1,
                  stepKey: current.kind === "field" ? current.key : current.kind,
                  stepTitle: current.title,
                  metadata: {
                    paymentComplete,
                    reason: "modal_closed",
                  },
                });
              }
              onClose();
            }}
            className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15"
            aria-label="Close admission check"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-[#027937] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-10 md:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#9be2b6]">
                {current.label}
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] md:text-5xl">
                {current.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
                {current.helper}
              </p>
            </div>

            <AdmissionCheckStepContent
              current={current}
              form={form}
              onTrackEvent={trackAdmissionEvent}
              postUtmeStudyGroupUrl={postUtmeStudyGroupUrl}
              updateField={updateField}
              whatsappChannelUrl={whatsappChannelUrl}
            />

            {phoneValidationError ? (
              <p className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-red-600">
                {phoneValidationError}
              </p>
            ) : null}

            {scoreValidationError ? (
              <p className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-red-600">
                {scoreValidationError}
              </p>
            ) : null}

            {submitError ? (
              <p className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-red-600">
                {submitError}
              </p>
            ) : null}

            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex-1">
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    className="h-12 w-full rounded-none bg-white px-7 text-base font-black text-[#002769] hover:bg-white/90"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>
                ) : null}
              </div>
              <div className="flex flex-1 justify-end">
                <Button
                  type="submit"
                  disabled={!canContinue || isSubmitting}
                  className="h-12 w-full min-w-36 rounded-none bg-white px-7 text-base font-black text-[#002769] hover:bg-white/90"
                >
                  {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                  {isLastStep
                    ? isSubmitting
                      ? "Opening payment..."
                      : "To Submit pay ₦1,000, for logistics"
                    : "Next"}
                  {!isSubmitting ? <ArrowRight className="size-4" /> : null}
                </Button>
              </div>
            </div>
          </form>

          <AdmissionCheckAfterPaymentCard
            handlePayment={handlePayment}
            isStartingPayment={isStartingPayment}
            paymentComplete={paymentComplete}
            paymentError={paymentError}
            submitted={submitted}
            whatsappChannelUrl={whatsappChannelUrl}
            whatsappMessage={whatsappMessage}
            onTrackEvent={trackAdmissionEvent}
          />

          {paymentComplete && showPaymentSuccessModal ? (
            <AdmissionPaymentSuccessModal
              form={form}
              isUpdatingLead={isUpdatingLead}
              onClose={() => {
                trackAdmissionEvent({ eventName: "payment_success_modal_closed" });
                setShowPaymentSuccessModal(false);
              }}
              onUpdateDetails={handleUpdateLeadDetails}
              updateError={updateError}
              updateField={updateField}
              updateSuccess={updateSuccess}
            />
          ) : null}

          <p className="mt-5 text-center text-xs leading-5 text-white/65">
            Disclaimer: 90percent provides admission guidance only. We do not
            guarantee admission, change JAMB scores, influence JAMB, or secure
            admission from any school.
          </p>
        </div>
      </div>
    </div>
  );
}

