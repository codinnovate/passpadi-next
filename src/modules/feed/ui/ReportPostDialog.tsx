"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { reportSchema, type ReportFormValues } from "../validation/feed.schemas";
import { useReportPostMutation } from "../features/feedApi";

interface ReportPostDialogProps {
  postId: string | null;
  onClose: () => void;
}

export default function ReportPostDialog({
  postId,
  onClose,
}: ReportPostDialogProps) {
  const [reportPost, { isLoading }] = useReportPostMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { reason: "" },
  });

  const onSubmit = async (data: ReportFormValues) => {
    if (!postId) return;
    try {
      await reportPost({ postId, reason: data.reason }).unwrap();
      reset();
      onClose();
    } catch {
      // Error handled by RTK Query
    }
  };

  return (
    <Dialog open={!!postId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Post</DialogTitle>
          <DialogDescription>
            Tell us why you&apos;re reporting this post.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Textarea
              placeholder="Describe the issue..."
              className="min-h-[100px] resize-none"
              {...register("reason")}
            />
            {errors.reason && (
              <p className="mt-1 text-xs text-destructive">
                {errors.reason.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Report"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
