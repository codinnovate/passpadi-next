"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader2, ImagePlus } from "lucide-react";
import {
  createPostSchema,
  type CreatePostFormValues,
} from "../validation/feed.schemas";
import { useCreatePostMutation } from "../features/feedApi";
import CustomFormField from "@/components/CustomFormField";
import { FormFieldType } from "@/types/types";

type ComposablePostType = "general" | "question" | "marketplace" | "job";

const POST_TYPES: { value: ComposablePostType; label: string }[] = [
  { value: "general", label: "General" },
  { value: "question", label: "Question" },
  { value: "marketplace", label: "Marketplace" },
  { value: "job", label: "Job" },
];

interface PostComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PostComposer({ open, onOpenChange }: PostComposerProps) {
  const [createPost, { isLoading }] = useCreatePostMutation();

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
      image: "",
      postType: "general",
    },
  });

  const { watch, setValue, reset, handleSubmit, control } = form;
  const postType = watch("postType");

  const onSubmit = async (data: CreatePostFormValues) => {
    const payload = {
      ...data,
      content: data.content ?? "",
      image: data.image || undefined,
      jobUrl: data.jobUrl || undefined,
      price: data.price ? Number(data.price) : undefined,
    };

    try {
      await createPost(payload).unwrap();
      reset();
      onOpenChange(false);
    } catch {
      // Error handled by RTK Query
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Post type chips */}
            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setValue("postType", type.value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    postType === type.value
                      ? "border-app-primary bg-app-primary/10 text-app-primary"
                      : "border-border text-muted-foreground hover:border-foreground/30"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <CustomFormField
              control={control}
              name="content"
              fieldType={FormFieldType.TEXTAREA}
              placeholder={
                postType === "question"
                  ? "Ask a question..."
                  : "What's on your mind?"
              }
            />

            {/* Image URL */}
            <CustomFormField
              control={control}
              name="image"
              label="Image URL (optional)"
              fieldType={FormFieldType.INPUT}
              placeholder="https://example.com/image.png"
              iconSrc={<ImagePlus className="size-4" />}
            />

            {/* Marketplace fields */}
            {postType === "marketplace" && (
              <div className="grid grid-cols-2 gap-3">
                <CustomFormField
                  control={control}
                  name="price"
                  label="Price"
                  fieldType={FormFieldType.INPUT}
                  placeholder="0.00"
                  inputType="number"
                />
                <CustomFormField
                  control={control}
                  name="currency"
                  label="Currency"
                  fieldType={FormFieldType.INPUT}
                  placeholder="NGN"
                />
              </div>
            )}

            {/* Job fields */}
            {postType === "job" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <CustomFormField
                    control={control}
                    name="company"
                    label="Company"
                    fieldType={FormFieldType.INPUT}
                    placeholder="Company name"
                  />
                  <CustomFormField
                    control={control}
                    name="location"
                    label="Location"
                    fieldType={FormFieldType.INPUT}
                    placeholder="Lagos, Nigeria"
                  />
                </div>
                <CustomFormField
                  control={control}
                  name="jobUrl"
                  label="Job URL"
                  fieldType={FormFieldType.INPUT}
                  placeholder="https://careers.example.com/job"
                />
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="min-w-[100px]">
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
