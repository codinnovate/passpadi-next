"use client";

import { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import {
  Camera,
  Lock1,
  TagCross,
  UserAdd,
  CloseCircle,
} from "iconsax-reactjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import RightSheetWrapper from "@/components/ui/right-sheet-wrapper";
import {
  useCreateGroupMutation,
  useGetUploadUrlMutation,
  useLazySearchUsersQuery,
} from "@/store/api";
import {
  createGroupSchema,
  type CreateGroupInput,
} from "@/lib/validations/group";

const categories = [
  "JAMB",
  "WAEC",
  "NECO",
  "Post-UTME",
  "General",
  "Study Tips",
];

type SelectedUser = {
  _id: string;
  fullname: string;
  username: string;
  profile_img: string;
};

export default function CreateGroupSheet() {
  const [open, setOpen] = useState(false);

  // Image state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tags state
  const [tagInput, setTagInput] = useState("");

  // Invite members state
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<SelectedUser[]>([]);
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // API hooks
  const [createGroup, { isLoading }] = useCreateGroupMutation();
  const [getUploadUrl] = useGetUploadUrlMutation();
  const [triggerSearch, { data: searchResults, isFetching: isSearching }] =
    useLazySearchUsersQuery();

  const form = useForm<CreateGroupInput>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      isPrivate: false,
      tags: [],
    },
  });

  const tags = form.watch("tags");

  // ── Image handling ──────────────────────────────────────────────
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB limit

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadImage = useCallback(
    async (file: File): Promise<string> => {
      const ext = file.name.split(".").pop() || "jpg";
      const { url: signedUrl, publicUrl } = await getUploadUrl({
        fileType: ext,
      }).unwrap();
      await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      return publicUrl;
    },
    [getUploadUrl]
  );

  // ── Tag handling ────────────────────────────────────────────────
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (!tag || tags.length >= 5 || tags.includes(tag)) return;
    form.setValue("tags", [...tags, tag]);
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      tags.filter((t) => t !== tagToRemove)
    );
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  // ── Member search ───────────────────────────────────────────────
  const handleMemberSearch = (value: string) => {
    setMemberSearch(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (value.trim().length < 2) return;

    searchTimerRef.current = setTimeout(() => {
      triggerSearch({ search: value.trim(), perPage: 8 });
    }, 300);
  };

  const addMember = (user: SelectedUser) => {
    if (selectedMembers.some((m) => m._id === user._id)) return;
    setSelectedMembers((prev) => [...prev, user]);
    setMemberSearch("");
  };

  const removeMember = (userId: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m._id !== userId));
  };

  const filteredSearchResults =
    searchResults?.data?.filter(
      (u) => !selectedMembers.some((m) => m._id === u._id)
    ) ?? [];

  // ── Submit ──────────────────────────────────────────────────────
  const onSubmit = async (data: CreateGroupInput) => {
    try {
      setIsUploading(true);

      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await createGroup({
        name: data.name,
        description: data.description,
        category: data.category,
        isPrivate: data.isPrivate,
        tags: data.tags.length > 0 ? data.tags : undefined,
        image: imageUrl,
        invitedMembers:
          selectedMembers.length > 0
            ? selectedMembers.map((m) => m._id)
            : undefined,
      }).unwrap();

      // Reset & close
      form.reset();
      setImagePreview(null);
      setImageFile(null);
      setSelectedMembers([]);
      setTagInput("");
      setMemberSearch("");
      setOpen(false);
    } catch {
      // Error handled by RTK Query
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitting = isLoading || isUploading;

  return (
    <>
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        className="rounded-full bg-app-primary text-white hover:bg-app-primary/90 gap-1.5"
      >
        <Plus size={16} />
        New Group
      </Button>

      <RightSheetWrapper
        open={open}
        onOpenChange={setOpen}
        title="Create Study Group"
        description="Set up a new group for collaborative learning"
        footer={
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full bg-app-primary text-white hover:bg-app-primary/90 h-11 rounded-xl font-medium"
          >
            {isSubmitting ? "Creating..." : "Create Group"}
          </Button>
        }
      >
        <Form {...form}>
          <form className="flex flex-col gap-5">
            {/* ── Group Image ────────────────────────────────── */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative group size-24 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 dark:border-white/20 hover:border-app-primary/50 transition-colors"
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Group"
                      className="size-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={24} className="text-white" variant="Bold" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <Camera size={24} variant="Bulk" />
                    <span className="text-[10px] font-medium">Add Photo</span>
                  </div>
                )}
              </button>
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-xs text-red font-medium hover:underline"
                >
                  Remove photo
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* ── Group Name ─────────────────────────────────── */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. JAMB 2026 Physics Squad"
                      className="h-11 rounded-xl bg-[#F5F5F7] border-none dark:bg-white/10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Description ────────────────────────────────── */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's this group about? What will members learn?"
                      className="min-h-24 rounded-xl bg-[#F5F5F7] border-none resize-none dark:bg-white/10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Category ───────────────────────────────────── */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => field.onChange(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          field.value === cat
                            ? "bg-app-primary text-white border-app-primary"
                            : "border-gray-200 text-gray-600 hover:border-app-primary/50 dark:border-white/20 dark:text-gray-300"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Tags ───────────────────────────────────────── */}
            <div className="space-y-2">
              <FormLabel>
                Tags{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </FormLabel>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-app-primary/10 text-app-primary px-2.5 py-1 rounded-full text-xs font-medium"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red transition-colors"
                      >
                        <TagCross size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {tags.length < 5 && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="h-10 rounded-xl bg-[#F5F5F7] border-none flex-1 dark:bg-white/10"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                    className="rounded-xl h-10 px-3"
                  >
                    Add
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {tags.length}/5 tags
              </p>
            </div>

            {/* ── Private Toggle ──────────────────────────────── */}
            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl bg-[#F5F5F7] dark:bg-white/10 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-9 rounded-lg bg-white dark:bg-white/10 shadow-sm">
                      <Lock1
                        size={18}
                        variant="Bold"
                        className="text-gray-500"
                      />
                    </div>
                    <div>
                      <FormLabel className="text-sm font-medium !mt-0">
                        Private Group
                      </FormLabel>
                      <FormDescription className="text-xs !mt-0.5">
                        Only invited members can join
                      </FormDescription>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* ── Invite Members ──────────────────────────────── */}
            <div className="space-y-2">
              <FormLabel className="flex items-center gap-2">
                <UserAdd size={16} variant="Bold" className="text-gray-500" />
                Invite Members{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </FormLabel>

              {/* Selected members chips */}
              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedMembers.map((member) => (
                    <span
                      key={member._id}
                      className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-white/10 pl-1 pr-2 py-1 rounded-full"
                    >
                      <Avatar className="size-5">
                        <AvatarImage
                          src={
                            member.profile_img ||
                            `https://api.dicebear.com/9.x/initials/svg?seed=${member.fullname}`
                          }
                          alt={member.fullname}
                        />
                        <AvatarFallback className="text-[8px] bg-app-primary text-white">
                          {member.fullname[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium truncate max-w-24">
                        {member.fullname}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeMember(member._id)}
                        className="text-gray-400 hover:text-red transition-colors"
                      >
                        <CloseCircle size={14} variant="Bold" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Search input */}
              <div className="relative">
                <Input
                  placeholder="Search by name or username..."
                  value={memberSearch}
                  onChange={(e) => handleMemberSearch(e.target.value)}
                  className="h-10 rounded-xl bg-[#F5F5F7] border-none dark:bg-white/10"
                />
                {memberSearch && (
                  <button
                    type="button"
                    onClick={() => setMemberSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Search results dropdown */}
              {memberSearch.trim().length >= 2 && (
                <div className="rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-gray-900 shadow-lg max-h-48 overflow-y-auto">
                  {isSearching ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                      Searching...
                    </div>
                  ) : filteredSearchResults.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                      No users found
                    </div>
                  ) : (
                    filteredSearchResults.map((user) => (
                      <button
                        key={user._id}
                        type="button"
                        onClick={() =>
                          addMember({
                            _id: user._id,
                            fullname: user.personal_info.fullname,
                            username: user.personal_info.username,
                            profile_img: user.personal_info.profile_img,
                          })
                        }
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <Avatar className="size-8">
                          <AvatarImage
                            src={
                              user.personal_info.profile_img ||
                              `https://api.dicebear.com/9.x/initials/svg?seed=${user.personal_info.fullname}`
                            }
                            alt={user.personal_info.fullname}
                          />
                          <AvatarFallback className="text-xs bg-app-primary text-white">
                            {user.personal_info.fullname[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.personal_info.fullname}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            @{user.personal_info.username}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {selectedMembers.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {selectedMembers.length} member
                  {selectedMembers.length !== 1 && "s"} will be invited
                </p>
              )}
            </div>
          </form>
        </Form>
      </RightSheetWrapper>
    </>
  );
}
