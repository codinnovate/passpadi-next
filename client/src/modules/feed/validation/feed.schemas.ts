import { z } from "zod";

export const createPostSchema = z
  .object({
    content: z.string().optional(),
    image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    postType: z.enum(["general", "question", "marketplace", "job"]),
    // Marketplace fields
    price: z.number().positive("Price must be positive").optional(),
    currency: z.string().optional(),
    // Job fields
    company: z.string().optional(),
    location: z.string().optional(),
    jobUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  })
  .refine((data) => data.content?.trim() || data.image, {
    message: "Post must have content or an image",
    path: ["content"],
  });

export type CreatePostFormValues = z.infer<typeof createPostSchema>;

export const replySchema = z
  .object({
    content: z.string().optional(),
    image: z.string().url().optional().or(z.literal("")),
  })
  .refine((data) => data.content?.trim() || data.image, {
    message: "Reply must have text or an image",
    path: ["content"],
  });

export type ReplyFormValues = z.infer<typeof replySchema>;

export const reportSchema = z.object({
  reason: z.string().min(5, "Reason must be at least 5 characters"),
});

export type ReportFormValues = z.infer<typeof reportSchema>;
