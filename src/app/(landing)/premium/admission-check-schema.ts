import { z } from "zod";

export const defaultAdmissionCheckForm = {
  name: "",
  email: "",
  phone: "",
  score: "",
  course: "",
  school: "",
  receiveAdmissionUpdates: "",
  writingPostUtme: "",
  note: "",
};

export type AdmissionCheckFormState = typeof defaultAdmissionCheckForm;
export type AdmissionCheckFieldKey = keyof AdmissionCheckFormState;

export type PaystackTransaction = {
  reference?: string;
  trans?: string;
  transaction?: string;
  status?: string;
  message?: string;
};

export const whatsappNumberMessage =
  "Enter a valid WhatsApp number as 08085552943, +2348085552943, or 2348085552943.";

export const jambScoreMessage = "Enter a valid JAMB score between 0 and 400.";

export const whatsappNumberSchema = z
  .string()
  .trim()
  .refine(
    (value) =>
      /^0\d{10}$/.test(value) ||
      /^\+234\d{10}$/.test(value) ||
      /^234\d{10}$/.test(value),
    whatsappNumberMessage
  );

export const jambScoreSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, jambScoreMessage)
  .refine((value) => {
    const score = Number(value);
    return Number.isInteger(score) && score >= 0 && score <= 400;
  }, jambScoreMessage);

export const admissionCheckSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: whatsappNumberSchema,
  score: jambScoreSchema,
  course: z.string().trim().min(2),
  school: z.string().trim().min(2),
  receiveAdmissionUpdates: z.enum(["yes", "no"]).or(z.literal("")),
  writingPostUtme: z.enum(["yes", "no"]).or(z.literal("")),
  note: z.string().trim().optional(),
});

export const sanitizeWhatsappInput = (value: string) => {
  const compact = value.replace(/\s+/g, "");
  const withAllowedChars = compact.startsWith("+")
    ? `+${compact.slice(1).replace(/\D/g, "")}`
    : compact.replace(/\D/g, "");

  if (withAllowedChars.startsWith("+234")) {
    return withAllowedChars.slice(0, 14);
  }

  if (withAllowedChars.startsWith("234")) {
    return withAllowedChars.slice(0, 13);
  }

  if (withAllowedChars.startsWith("0")) {
    return withAllowedChars.slice(0, 11);
  }

  if (withAllowedChars.startsWith("+")) {
    return withAllowedChars.slice(0, 4);
  }

  return withAllowedChars.slice(0, 13);
};

export const sanitizeJambScoreInput = (value: string) =>
  value.replace(/\D/g, "").slice(0, 3);

export type AdmissionCheckStep =
  | {
      kind: "field";
      key: AdmissionCheckFieldKey;
      label: string;
      title: string;
      helper: string;
      placeholder: string;
      inputMode?: "numeric";
      type?: "email";
      optional?: boolean;
      multiline?: boolean;
    }
  | {
      kind: "admission-updates" | "admission-channel" | "post-utme";
      label: string;
      title: string;
      helper: string;
    };

export const admissionCheckQuestions: AdmissionCheckStep[] = [
  {
    kind: "field",
    key: "name",
    label: "Full name",
    title: "What is your full name?",
    helper: "Use the name our admission adviser should call you.",
    placeholder: "e.g. Chiamaka Okafor",
  },
  {
    kind: "field",
    key: "email",
    label: "Email address",
    title: "What email should we use?",
    helper: "We use this for your admission logistics follow-up if needed.",
    placeholder: "you@example.com",
    type: "email",
  },
  {
    kind: "field",
    key: "phone",
    label: "WhatsApp number",
    title: "What is your WhatsApp number?",
    helper: "Our advisers and admission updates work best through WhatsApp.",
    placeholder: "080...",
  },
  {
    kind: "admission-updates",
    label: "Admission updates",
    title: "Do you want admission updates about your school?",
    helper:
      "We can send you information about your school, screening timelines, admission lists, and other real-time university updates.",
  },
  {
    kind: "admission-channel",
    label: "Admission channel",
    title: "Here is the Admission Updates channel link",
    helper:
      "Join the channel now so you do not miss screening dates, admission lists, Post-UTME updates, and deadline changes.",
  },
  {
    kind: "field",
    key: "score",
    label: "JAMB score",
    title: "What was your 2026 JAMB score?",
    helper: "Enter the score exactly as it appears on your result.",
    placeholder: "e.g. 243",
    inputMode: "numeric",
  },
  {
    kind: "field",
    key: "course",
    label: "Course",
    title: "What course are you aiming for?",
    helper: "This helps us compare your score with the competitiveness of the course.",
    placeholder: "e.g. Nursing",
  },
  {
    kind: "field",
    key: "school",
    label: "School",
    title: "What school is your first choice?",
    helper: "You can enter a university, polytechnic, college, or institution name.",
    placeholder: "e.g. UNILAG",
  },
  {
    kind: "post-utme",
    label: "Post-UTME",
    title: "Will you be writing Post-UTME?",
    helper:
      "If yes, join our Post-UTME study group so you can start preparing with other serious candidates.",
  },
  {
    kind: "field",
    key: "note",
    label: "Extra note",
    title: "Anything else worrying you?",
    helper: "Optional: O'level result, second choice, catchment, deadline, or any concern.",
    placeholder: "Tell us what you are worried about...",
    optional: true,
    multiline: true,
  },
];
