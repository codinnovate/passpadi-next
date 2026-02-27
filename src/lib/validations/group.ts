import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(3, "Group name must be at least 3 characters")
    .max(60, "Group name must be 60 characters or less"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be 500 characters or less"),
  category: z.string().min(1, "Please select a category"),
  isPrivate: z.boolean(),
  tags: z.array(z.string()).max(5, "Maximum 5 tags allowed"),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
