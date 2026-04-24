import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  admissionCheckQuestions,
  defaultAdmissionCheckForm,
  type AdmissionCheckFieldKey,
  jambScoreMessage,
  jambScoreSchema,
  type PaystackTransaction,
  whatsappNumberMessage,
  whatsappNumberSchema,
} from "./admission-check-schema";
import {
  getAdmissionTrackingContext,
  syncPremiumFunnelProgress,
  trackAdmissionEvent,
} from "./admission-tracking";

const whatsappChannelUrl =
  process.env.NEXT_PUBLIC_ADMISSION_WHATSAPP_CHANNEL_URL || "#whatsapp";
const whatsappExpertUrl =
  process.env.NEXT_PUBLIC_ADMISSION_WHATSAPP_EXPERT_URL || whatsappChannelUrl;
const postUtmeStudyGroupUrl =
  process.env.NEXT_PUBLIC_POST_UTME_STUDY_GROUP_URL || "#post-utme-study-group";
const serverUrl = (process.env.NEXT_PUBLIC_SERVER || "").trim().replace(/\/+$/, "");
const stepTrackingKeys = [
  "question_1_name",
  "question_2_email",
  "question_3_phone",
  "question_4_admission_updates",
  "admission_channel",
  "question_5_score",
  "question_6_course",
  "question_7_school",
  "post_utme_question",
  "extra_note",
];

export function useAdmissionCheckFlow(options?: { isFunnelOpen?: boolean }) {
  const isFunnelOpen = options?.isFunnelOpen ?? false;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultAdmissionCheckForm);
  const trackedAnswersRef = useRef<Set<AdmissionCheckFieldKey>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [isUpdatingLead, setIsUpdatingLead] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [leadId, setLeadId] = useState("");

  const current = admissionCheckQuestions[step] ?? admissionCheckQuestions[0]!;
  const progress = Math.round(((step + 1) / admissionCheckQuestions.length) * 100);
  const isLastStep = step === admissionCheckQuestions.length - 1;
  const receiveAdmissionUpdates = form.receiveAdmissionUpdates ?? "";
  const stepKey = stepTrackingKeys[step] || `step_${step + 1}`;
  const stepMetadata = {
    stepIndex: step + 1,
    stepKey,
    stepTitle: current.title,
  };

  const receiveAdmissionUpdatesBool =
    receiveAdmissionUpdates === "yes"
      ? true
      : receiveAdmissionUpdates === "no"
        ? false
        : undefined;
  const writingPostUtmeBool =
    form.writingPostUtme === "yes"
      ? true
      : form.writingPostUtme === "no"
        ? false
        : undefined;

  const syncFunnelProgress = useCallback(
    (funnelSource: string) => {
      syncPremiumFunnelProgress({
        funnelSource,
        funnelStepIndex: step + 1,
        funnelStepKey: stepKey,
        funnelStepTitle: current.title,
        name: form.name,
        email: form.email,
        phone: form.phone,
        jambScore: form.score,
        course: form.course,
        school: form.school,
        note: form.note,
        receiveAdmissionUpdates: receiveAdmissionUpdatesBool,
        writingPostUtme: writingPostUtmeBool,
      });
    },
    [
      step,
      stepKey,
      current.title,
      form.name,
      form.email,
      form.phone,
      form.score,
      form.course,
      form.school,
      form.note,
      form.writingPostUtme,
      receiveAdmissionUpdatesBool,
      writingPostUtmeBool,
    ]
  );

  const flushFunnelSnapshot = useCallback(() => {
    syncFunnelProgress("typeform_flush");
  }, [syncFunnelProgress]);

  useEffect(() => {
    trackAdmissionEvent({
      eventName: "admission_form_step_viewed",
      ...stepMetadata,
      metadata: {
        kind: current.kind,
        fieldKey: current.kind === "field" ? current.key : current.kind,
      },
    });

    trackAdmissionEvent({
      eventName: `${stepKey}_viewed`,
      ...stepMetadata,
    });

    if (isFunnelOpen) {
      syncFunnelProgress("typeform_step_viewed");
    }
  }, [current, stepKey, stepMetadata.stepIndex, stepMetadata.stepTitle, isFunnelOpen, syncFunnelProgress]);

  useEffect(() => {
    if (!isFunnelOpen) return;

    const timer = window.setTimeout(() => {
      syncFunnelProgress("typeform_form_snapshot");
    }, 400);

    return () => window.clearTimeout(timer);
  }, [form, isFunnelOpen, syncFunnelProgress]);

  const whatsappMessage = useMemo(() => {
    const lines = [
      "Hello 90percent, I want to know my 2026 admission chances.",
      `Name: ${form.name || "-"}`,
      `Email: ${form.email || "-"}`,
      `JAMB score: ${form.score || "-"}`,
      `Course: ${form.course || "-"}`,
      `School: ${form.school || "-"}`,
      `Phone/WhatsApp: ${form.phone || "-"}`,
      `Admission updates: ${receiveAdmissionUpdates || "-"}`,
      `Writing Post-UTME: ${form.writingPostUtme || "-"}`,
      form.note ? `Extra note: ${form.note}` : "",
    ].filter(Boolean);

    return `${whatsappExpertUrl}${
      whatsappExpertUrl.includes("?") ? "&" : "?"
    }text=${encodeURIComponent(lines.join("\n"))}`;
  }, [form, receiveAdmissionUpdates]);

  const getTrackingForField = (key: AdmissionCheckFieldKey) => {
    const fieldStepIndex = admissionCheckQuestions.findIndex((question) => {
      if (question.kind === "field") {
        return question.key === key;
      }

      if (question.kind === "admission-updates") {
        return key === "receiveAdmissionUpdates";
      }

      if (question.kind === "post-utme") {
        return key === "writingPostUtme";
      }

      return false;
    });
    const question = admissionCheckQuestions[fieldStepIndex];

    return {
      stepIndex: fieldStepIndex + 1,
      stepKey: stepTrackingKeys[fieldStepIndex] || `step_${fieldStepIndex + 1}`,
      stepTitle: question?.title || key,
    };
  };

  const updateField = (key: AdmissionCheckFieldKey, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));

    if (value.trim() && !trackedAnswersRef.current.has(key)) {
      trackedAnswersRef.current.add(key);
      const fieldTracking = getTrackingForField(key);

      trackAdmissionEvent({
        eventName: `${fieldTracking.stepKey}_answered`,
        ...fieldTracking,
        metadata: {
          fieldKey: key,
          hasValue: true,
          valueLength: value.trim().length,
          source: "input_change",
        },
      });
    }
  };

  const phoneValidationError =
    current.kind === "field" &&
    current.key === "phone" &&
    form.phone.trim().length > 0 &&
    !whatsappNumberSchema.safeParse(form.phone).success
      ? whatsappNumberMessage
      : "";

  const scoreValidationError =
    current.kind === "field" &&
    current.key === "score" &&
    form.score.trim().length > 0 &&
    !jambScoreSchema.safeParse(form.score).success
      ? jambScoreMessage
      : "";

  const canContinue =
    current.kind === "admission-channel" ||
    (current.kind === "admission-updates" &&
      receiveAdmissionUpdates.trim().length > 0) ||
    (current.kind === "post-utme" && form.writingPostUtme.trim().length > 0) ||
    (current.kind === "field" &&
      (current.optional || form[current.key].trim().length > 0) &&
      !phoneValidationError &&
      !scoreValidationError);

  const validateCurrentStep = () => {
    if (current.kind === "field" && current.key === "phone") {
      const result = whatsappNumberSchema.safeParse(form.phone);
      if (!result.success) {
        setSubmitError(result.error.issues[0]?.message || whatsappNumberMessage);
        return false;
      }
    }

    if (current.kind === "field" && current.key === "score") {
      const result = jambScoreSchema.safeParse(form.score);
      if (!result.success) {
        setSubmitError(result.error.issues[0]?.message || jambScoreMessage);
        return false;
      }
    }

    return true;
  };

  const getCurrentAnswerMetadata = () => {
    if (current.kind === "field") {
      const value = form[current.key].trim();
      return {
        fieldKey: current.key,
        hasValue: value.length > 0,
        valueLength: value.length,
      };
    }

    if (current.kind === "admission-updates") {
      return {
        answer: receiveAdmissionUpdates || "",
      };
    }

    if (current.kind === "post-utme") {
      return {
        answer: form.writingPostUtme || "",
      };
    }

    return {
      actionRequired: "join_admission_updates",
    };
  };

  const trackCurrentStepAnswered = () => {
    const metadata = getCurrentAnswerMetadata();

    trackAdmissionEvent({
      eventName: "admission_form_step_answered",
      ...stepMetadata,
      metadata,
    });

    trackAdmissionEvent({
      eventName:
        current.kind === "admission-updates" && receiveAdmissionUpdates
          ? `${stepKey}_answered_${receiveAdmissionUpdates}`
          : current.kind === "post-utme" && form.writingPostUtme
            ? `${stepKey}_answered_${form.writingPostUtme}`
            : `${stepKey}_answered`,
      ...stepMetadata,
      metadata,
    });
  };

  const goNext = () => {
    trackAdmissionEvent({
      eventName: "admission_form_next_clicked",
      ...stepMetadata,
    });

    if (!canContinue) {
      trackAdmissionEvent({
        eventName: "admission_form_validation_failed",
        ...stepMetadata,
        metadata: {
          reason: "missing_or_invalid_answer",
        },
      });
      setSubmitError("Please answer this question to continue.");
      return;
    }
    if (!validateCurrentStep()) {
      trackAdmissionEvent({
        eventName: "admission_form_validation_failed",
        ...stepMetadata,
        metadata: {
          reason: "schema_validation_failed",
        },
      });
      return;
    }
    trackCurrentStepAnswered();
    setSubmitError("");
    setStep((currentStep) => {
      const shouldSkipChannel =
        admissionCheckQuestions[currentStep]?.kind === "admission-updates" &&
        receiveAdmissionUpdates === "no";

      return Math.min(
        admissionCheckQuestions.length - 1,
        currentStep + (shouldSkipChannel ? 2 : 1)
      );
    });
  };

  const goBack = () => {
    trackAdmissionEvent({
      eventName: "admission_form_back_clicked",
      ...stepMetadata,
    });
    setSubmitError("");
    setStep((currentStep) => {
      const previous = currentStep - 1;
      const shouldSkipChannel =
        admissionCheckQuestions[previous]?.kind === "admission-channel" &&
        receiveAdmissionUpdates === "no";

      return Math.max(0, currentStep - (shouldSkipChannel ? 2 : 1));
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLastStep) {
      goNext();
      return;
    }

    setSubmitError("");
    setPaymentError("");
    setIsSubmitting(true);
    trackAdmissionEvent({
      eventName: "admission_form_submitted",
      ...stepMetadata,
      metadata: {
        answeredFields: Object.entries(form).filter(([, value]) => value.trim()).length,
      },
    });

    try {
      const phoneResult = whatsappNumberSchema.safeParse(form.phone);
      if (!phoneResult.success) {
        setSubmitError(phoneResult.error.issues[0]?.message || whatsappNumberMessage);
        setStep(2);
        return;
      }

      const scoreResult = jambScoreSchema.safeParse(form.score);
      if (!scoreResult.success) {
        setSubmitError(scoreResult.error.issues[0]?.message || jambScoreMessage);
        setStep(5);
        return;
      }

      syncFunnelProgress("pre_lead_submit");

      const response = await fetch(`${serverUrl}/api/v1/admission-leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitorId: getAdmissionTrackingContext()?.visitorId,
          sessionId: getAdmissionTrackingContext()?.sessionId,
          name: form.name,
          email: form.email,
          phone: form.phone,
          jambScore: form.score,
          course: form.course,
          school: form.school,
          receiveAdmissionUpdates:
            receiveAdmissionUpdates === "yes"
              ? true
              : receiveAdmissionUpdates === "no"
                ? false
                : undefined,
          writingPostUtme:
            form.writingPostUtme === "yes"
              ? true
              : form.writingPostUtme === "no"
                ? false
                : undefined,
          note: form.note,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not save admission details");
      }

      const result = await response.json();
      const capturedLeadId = result?.data?.id || "";
      if (!capturedLeadId) {
        throw new Error("Admission lead id missing");
      }

      setLeadId(capturedLeadId);
      setSubmitted(true);
      trackAdmissionEvent({
        eventName: "lead_created",
        metadata: {
          leadId: capturedLeadId,
        },
      });
      await startPayment(capturedLeadId);
    } catch {
      trackAdmissionEvent({
        eventName: "admission_form_submit_failed",
        metadata: {
          stepIndex: step + 1,
        },
      });
      setSubmitError(
        "We could not continue to payment right now. Please try again or use the Pay button below."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const startPayment = async (paymentLeadId: string) => {
    if (!paymentLeadId) {
      setPaymentError("Please submit your details before payment.");
      return;
    }

    setPaymentError("");
    setIsStartingPayment(true);
    trackAdmissionEvent({
      eventName: "payment_started",
      metadata: {
        leadId: paymentLeadId,
      },
    });

    try {
      const response = await fetch(
        `${serverUrl}/api/v1/payments/admission-logistics`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ leadId: paymentLeadId }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not start payment");
      }

      const result = await response.json();
      const accessCode = result?.data?.access_code;
      if (!accessCode) {
        throw new Error("Paystack access code missing");
      }

      const { default: PaystackPop } = await import("@paystack/inline-js");
      const popup = new PaystackPop();
      trackAdmissionEvent({
        eventName: "paystack_modal_opened",
        metadata: {
          leadId: paymentLeadId,
        },
      });

      popup.resumeTransaction(accessCode, {
        onSuccess: async (transaction: PaystackTransaction) => {
          const reference =
            transaction.reference || transaction.trans || transaction.transaction;
          trackAdmissionEvent({
            eventName: "paystack_payment_success_callback",
            metadata: {
              leadId: paymentLeadId,
              reference: reference || "",
            },
          });

          try {
            if (reference) {
              await verifyAdmissionPayment(reference);
            }

            setPaymentComplete(true);
            setShowPaymentSuccessModal(true);
            setPaymentError("");
            trackAdmissionEvent({
              eventName: "payment_success",
              metadata: {
                leadId: paymentLeadId,
                reference: reference || "",
              },
            });
          } catch {
            setPaymentError(
              "Payment was successful, but we could not confirm it here. Please contact support with your payment reference."
            );
          }
        },
        onCancel: () => {
          setPaymentError("Payment was closed. You can reopen it with the Pay button.");
          trackAdmissionEvent({
            eventName: "payment_cancelled",
            metadata: {
              leadId: paymentLeadId,
            },
          });
        },
        onError: () => {
          setPaymentError("Paystack could not open payment. Please try again.");
          trackAdmissionEvent({
            eventName: "payment_failed",
            metadata: {
              leadId: paymentLeadId,
              stage: "paystack_modal",
            },
          });
        },
      });
    } catch {
      setPaymentError("We could not start Paystack payment. Please try again.");
      trackAdmissionEvent({
        eventName: "payment_failed",
        metadata: {
          leadId: paymentLeadId,
          stage: "initialize",
        },
      });
    } finally {
      setIsStartingPayment(false);
    }
  };

  const handlePayment = async () => {
    trackAdmissionEvent({
      eventName: "payment_retry_clicked",
      metadata: {
        leadId,
      },
    });
    await startPayment(leadId);
  };

  const handleUpdateLeadDetails = async () => {
    if (!leadId) {
      setUpdateError("We could not find your admission request to update.");
      return;
    }

    setUpdateError("");
    setUpdateSuccess("");
    setIsUpdatingLead(true);

    try {
      const phoneResult = whatsappNumberSchema.safeParse(form.phone);
      if (!phoneResult.success) {
        setUpdateError(phoneResult.error.issues[0]?.message || whatsappNumberMessage);
        return;
      }

      const scoreResult = jambScoreSchema.safeParse(form.score);
      if (!scoreResult.success) {
        setUpdateError(scoreResult.error.issues[0]?.message || jambScoreMessage);
        return;
      }

      const trackingContext = getAdmissionTrackingContext();
      const response = await fetch(
        `${serverUrl}/api/v1/admission-leads/${leadId}/details`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitorId: trackingContext?.visitorId,
            sessionId: trackingContext?.sessionId,
            name: form.name,
            email: form.email,
            phone: form.phone,
            jambScore: form.score,
            course: form.course,
            school: form.school,
            receiveAdmissionUpdates:
              receiveAdmissionUpdates === "yes"
                ? true
                : receiveAdmissionUpdates === "no"
                  ? false
                  : undefined,
            writingPostUtme:
              form.writingPostUtme === "yes"
                ? true
                : form.writingPostUtme === "no"
                  ? false
                  : undefined,
            note: form.note,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not update details");
      }

      setUpdateSuccess("Your details have been updated.");
      trackAdmissionEvent({
        eventName: "paid_lead_details_updated",
        metadata: {
          leadId,
        },
      });
    } catch {
      setUpdateError("We could not update your details right now. Please try again.");
      trackAdmissionEvent({
        eventName: "paid_lead_details_update_failed",
        metadata: {
          leadId,
        },
      });
    } finally {
      setIsUpdatingLead(false);
    }
  };

  const verifyAdmissionPayment = async (reference: string) => {
    const response = await fetch(
      `${serverUrl}/api/v1/payments/verify?reference=${encodeURIComponent(reference)}`
    );

    if (!response.ok) {
      throw new Error("Could not verify payment");
    }
  };

  return {
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
    questionsLength: admissionCheckQuestions.length,
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
  };
}
