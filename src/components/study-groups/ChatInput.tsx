"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, X, ImagePlus, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetUploadUrlMutation } from "@/store/api";
import { useSocket } from "@/components/SocketProvider";
import type { GroupMessage, MessageType } from "@/types/group";

interface ChatInputProps {
  onSend: (content: string, replyToId?: string, type?: MessageType, mediaUrl?: string) => void;
  onTyping: () => void;
  onStopTyping: () => void;
  replyTo: GroupMessage | null;
  onCancelReply: () => void;
  disabled?: boolean;
  groupId: string;
}

export default function ChatInput({
  onSend,
  onTyping,
  onStopTyping,
  replyTo,
  onCancelReply,
  disabled,
  groupId,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTyping = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [getUploadUrl] = useGetUploadUrlMutation();
  const { socket } = useSocket();

  useEffect(() => {
    if (replyTo) inputRef.current?.focus();
  }, [replyTo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);

    if (!isTyping.current) {
      isTyping.current = true;
      onTyping();
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      isTyping.current = false;
      onStopTyping();
    }, 2000);
  }

  // Upload a file to S3 and return the public URL
  const uploadToS3 = useCallback(async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop() || "bin";
    const { url: signedUrl, publicUrl } = await getUploadUrl({ fileType: ext }).unwrap();
    await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    return publicUrl;
  }, [getUploadUrl]);

  // ── Image handling ─────────────────────────────────────────────
  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    // Reset file input so re-selecting the same file works
    e.target.value = "";
  }

  function clearImage() {
    setImagePreview(null);
    setImageFile(null);
  }

  // ── Voice recording ────────────────────────────────────────────
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);

      socket?.emit("recording", groupId);
    } catch {
      // Permission denied or not supported
    }
  }

  async function stopRecording(send: boolean) {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    socket?.emit("stop_recording", groupId);

    return new Promise<void>((resolve) => {
      recorder.onstop = async () => {
        // Stop all tracks
        recorder.stream.getTracks().forEach((t) => t.stop());

        if (send && chunksRef.current.length > 0) {
          setUploading(true);
          try {
            const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
            const ext = recorder.mimeType.includes("webm") ? "webm" : "m4a";
            const file = new File([blob], `voice-note.${ext}`, { type: recorder.mimeType });
            const publicUrl = await uploadToS3(file);
            onSend("", replyTo?._id, "audio", publicUrl);
            onCancelReply();
          } catch {
            // Upload failed — silently discard
          } finally {
            setUploading(false);
          }
        }

        setIsRecording(false);
        setRecordingDuration(0);
        chunksRef.current = [];
        mediaRecorderRef.current = null;
        resolve();
      };

      recorder.stop();
    });
  }

  // ── Send ───────────────────────────────────────────────────────
  async function handleSend() {
    if (uploading) return;

    // Image message
    if (imageFile) {
      setUploading(true);
      try {
        const publicUrl = await uploadToS3(imageFile);
        onSend(text.trim(), replyTo?._id, "image", publicUrl);
      } catch {
        // Upload failed
        setUploading(false);
        return;
      }
      setUploading(false);
      setText("");
      clearImage();
      onCancelReply();
      resetTextarea();
      return;
    }

    // Text message
    const trimmed = text.trim();
    if (!trimmed) return;

    onSend(trimmed, replyTo?._id);
    setText("");
    onCancelReply();
    isTyping.current = false;
    onStopTyping();
    resetTextarea();
  }

  function resetTextarea() {
    if (inputRef.current) inputRef.current.style.height = "auto";
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  function formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const canSend = text.trim().length > 0 || imageFile !== null;

  // ── Recording UI ───────────────────────────────────────────────
  if (isRecording) {
    return (
      <div className="border-t border-gray-100 dark:border-white/10 bg-white dark:bg-gray-950 px-3 py-2">
        <div className="flex items-center gap-3">
          {/* Cancel */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => stopRecording(false)}
            className="size-10 shrink-0 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <X size={20} />
          </Button>

          {/* Recording indicator */}
          <div className="flex-1 flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-red-500">
              {formatDuration(recordingDuration)}
            </span>
            <span className="text-xs text-muted-foreground">Recording...</span>
          </div>

          {/* Send voice note */}
          <Button
            size="icon"
            onClick={() => stopRecording(true)}
            disabled={uploading}
            className="size-10 shrink-0 rounded-xl bg-app-primary text-white hover:bg-app-primary/90"
          >
            {uploading ? (
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>
      </div>
    );
  }

  // ── Normal UI ──────────────────────────────────────────────────
  return (
    <div className="border-t border-gray-100 dark:border-white/10 bg-white dark:bg-gray-950 px-3 py-2">
      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center justify-between bg-app-primary/5 dark:bg-app-primary/10 rounded-lg px-3 py-2 mb-2 border-l-2 border-app-primary">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-app-primary">
              Replying to {replyTo.sender?.personal_info?.fullname}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {replyTo.content}
            </p>
          </div>
          <button
            onClick={onCancelReply}
            className="shrink-0 ml-2 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Image preview strip */}
      {imagePreview && (
        <div className="relative inline-block mb-2">
          <img
            src={imagePreview}
            alt="Preview"
            className="h-20 rounded-lg object-cover"
          />
          <button
            onClick={clearImage}
            className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-foreground/80 text-background flex items-center justify-center"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Attach button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="size-10 shrink-0 rounded-xl text-muted-foreground hover:text-app-primary"
        >
          <ImagePlus size={20} />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Textarea */}
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => {
            handleChange(e);
            autoResize(e.target);
          }}
          onKeyDown={handleKeyDown}
          placeholder={imageFile ? "Add a caption..." : "Type a message..."}
          rows={1}
          disabled={disabled || uploading}
          className="flex-1 resize-none rounded-xl bg-[#F5F5F7] dark:bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-app-primary/30 disabled:opacity-50"
        />

        {/* Mic button (shown when no text and no image) OR Send button */}
        {canSend ? (
          <Button
            size="icon"
            onClick={handleSend}
            disabled={disabled || uploading}
            className="size-10 shrink-0 rounded-xl bg-app-primary text-white hover:bg-app-primary/90 disabled:opacity-40"
          >
            {uploading ? (
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            onClick={startRecording}
            disabled={disabled}
            className="size-10 shrink-0 rounded-xl text-muted-foreground hover:text-app-primary hover:bg-app-primary/5"
          >
            <Mic size={20} />
          </Button>
        )}
      </div>
    </div>
  );
}
