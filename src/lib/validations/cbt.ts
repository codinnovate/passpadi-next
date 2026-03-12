import { z } from "zod";

export const cbtSessionSchema = z.object({
  examType: z.enum(["jamb", "waec", "neco", "post-utme"], {
    message: "Please select an exam type",
  }),
  subjects: z
    .array(
      z.object({
        name: z.string().min(1),
        questionsCount: z.number().min(5).max(50),
      })
    )
    .min(1, "Select at least one subject")
    .max(9, "Too many subjects selected"),
  questionsPerSubject: z
    .number()
    .min(5, "Minimum 5 questions")
    .max(50, "Maximum 50 questions"),
  timeLimit: z
    .number()
    .min(5, "Minimum 5 minutes")
    .max(180, "Maximum 180 minutes"),
  mode: z.enum(["exam", "practice"]).optional(),
});

export type CbtSessionInput = z.infer<typeof cbtSessionSchema>;
