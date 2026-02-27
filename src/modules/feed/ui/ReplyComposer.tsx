"use client";

import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetUploadUrlMutation } from "@/store/api";
import { SendHorizontal, Loader2, ImagePlus, X } from "lucide-react";

interface ReplyComposerProps {
  userName?: string;
  userAvatar?: string;
  isLoading: boolean;
  onSubmit: (content: string, image?: string) => void;
}

export default function ReplyComposer({
  userName,
  userAvatar,
  isLoading,
  onSubmit,
}: ReplyComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [getUploadUrl] = useGetUploadUrlMutation();

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const uploadImage = async (file: File): Promise<string | undefined> => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    try {
      const result = await getUploadUrl({ fileType: ext }).unwrap();
      await fetch(result.url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      return result.publicUrl;
    } catch (err) {
      console.error("Image upload failed:", err);
      return undefined;
    }
  };

  const handleSubmit = async () => {
    const content = textareaRef.current?.value.trim();
    if (!content && !imageFile) return;

    let imageUrl: string | undefined;
    if (imageFile) {
      setIsUploading(true);
      imageUrl = await uploadImage(imageFile);
      setIsUploading(false);
    }

    onSubmit(content || "", imageUrl);

    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "auto";
    }
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const busy = isLoading || isUploading;

  return (
    <div className="sticky bottom-0 border-t bg-background p-4">
      <div className="flex items-start gap-3">
        <Avatar className="size-8 shrink-0 mt-1">
          {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
          <AvatarFallback className="text-[10px] font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="rounded-lg border bg-muted/30 focus-within:ring-1 focus-within:ring-app-primary transition-shadow">
            <textarea
              ref={textareaRef}
              placeholder="Write a reply..."
              rows={1}
              className="w-full resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              onKeyDown={handleKeyDown}
              onInput={handleInput}
            />

            {/* Image preview */}
            {imagePreview && (
              <div className="px-3 pb-2">
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-32 rounded-md border object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 rounded-full bg-destructive text-white p-0.5 hover:bg-destructive/80 transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Actions bar */}
            <div className="flex items-center justify-between border-t px-3 py-1.5">
              <div className="flex items-center gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="size-4" />
                </Button>
              </div>

              <Button
                size="sm"
                disabled={busy}
                onClick={handleSubmit}
                className="h-7 gap-1.5 text-xs"
              >
                {busy ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <SendHorizontal className="size-3.5" />
                )}
                {isUploading ? "Uploading..." : "Reply"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
