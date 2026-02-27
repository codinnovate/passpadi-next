"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { RootState } from "@/store/store";
import { useUpdateProfileMutation, useLogoutMutation } from "@/store/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import { FormFieldType } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Edit2,
  Sms,
  Call,
  ShieldTick,
  Calendar,
  Crown1,
  Logout,
  Flash,
  TickCircle,
  CloseCircle,
  User,
  UserTag,
} from "iconsax-reactjs";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function planLabel(plan?: string) {
  if (!plan) return "Free";
  const labels: Record<string, string> = {
    trial: "Free Trial",
    "90percent_pro_monthly": "Pro Monthly",
    "90percent_pro_yearly": "Pro Yearly",
    free: "Free",
  };
  return labels[plan] || plan;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [logout] = useLogoutMutation();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-500">
            You need to be logged in to view your profile.
          </p>
          <Button className="mt-4" onClick={() => router.push("/login")}>
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  const info = user.personal_info || user;
  const fullname = info.fullname || "";
  const username = info.username || "";
  const email = info.email || "";
  const bio = info.bio || "";
  const profileImg = info.profile_img || "";
  const phone = info.phoneNumber || "";
  const emailVerified = info.isEmailVerified ?? false;
  const joinDate = info.createdAt || user.createdAt || "";
  const streak = user.streak ?? 0;
  const role = user.role || "user";
  const subscription = user.subscription;
  const has2FA = info.userPreferences?.enable2FA ?? false;
  const initials = fullname ? getInitials(fullname) : "U";

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-2">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-900">
        <div className="h-32 bg-gradient-to-r from-app-primary via-blue-500 to-purple" />

        <div className="relative px-6 pb-6">
          <div className="-mt-14 flex items-end justify-between">
            <Avatar className="size-24 border-4 border-white shadow-lg dark:border-gray-900">
              <AvatarImage src={profileImg} alt={fullname} />
              <AvatarFallback className="bg-app-primary text-2xl font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            <EditProfileDialog user={user} />
          </div>

          <div className="mt-3 space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold capitalize text-foreground">
                {fullname}
              </h1>
              {role !== "user" && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {role}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">@{username}</p>
            {bio && (
              <p className="mt-2 max-w-lg text-sm text-foreground/80">{bio}</p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar size={16} variant="Linear" />
              <span>Joined {formatDate(joinDate)}</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-orange-500">
                <Flash size={16} variant="Bold" />
                <span>{streak} day streak</span>
              </div>
            )}
            {subscription?.status === "active" && (
              <div className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
                <Crown1 size={16} variant="Bold" />
                <span>{planLabel(subscription.plan)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="details" className="flex-1">
            Details
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1">
            Security
          </TabsTrigger>
          {subscription && (
            <TabsTrigger value="subscription" className="flex-1">
              Subscription
            </TabsTrigger>
          )}
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="mt-4 space-y-4">
          <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Personal Information
            </h3>
            <div className="space-y-4">
              <InfoRow
                icon={<User size={16} variant="Linear" />}
                label="Full Name"
                value={fullname}
                capitalize
              />
              <Separator />
              <InfoRow
                icon={<UserTag size={16} variant="Linear" />}
                label="Username"
                value={username}
              />
              <Separator />
              <InfoRow
                icon={<Sms size={16} variant="Linear" />}
                label="Email"
                value={email}
                badge={
                  emailVerified ? (
                    <Badge
                      variant="secondary"
                      className="gap-1 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                    >
                      <TickCircle size={12} variant="Bold" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="gap-1 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                    >
                      <CloseCircle size={12} variant="Bold" />
                      Unverified
                    </Badge>
                  )
                }
              />
              <Separator />
              <InfoRow
                icon={<Call size={16} variant="Linear" />}
                label="Phone"
                value={phone || "Not set"}
                muted={!phone}
              />
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-4 space-y-4">
          <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Security Settings
            </h3>
            <div className="space-y-4">
              <InfoRow
                icon={<ShieldTick size={16} variant="Linear" />}
                label="Two-Factor Authentication"
                value={has2FA ? "Enabled" : "Disabled"}
                badge={
                  has2FA ? (
                    <Badge
                      variant="secondary"
                      className="gap-1 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                    >
                      <TickCircle size={12} variant="Bold" />
                      On
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="text-muted-foreground"
                    >
                      Off
                    </Badge>
                  )
                }
              />
              <Separator />
              <InfoRow
                icon={<Sms size={16} variant="Linear" />}
                label="Email Notifications"
                value={
                  info.userPreferences?.emailNotification
                    ? "Enabled"
                    : "Disabled"
                }
              />
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-red-500">
              Danger Zone
            </h3>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={handleLogout}
            >
              <Logout size={16} variant="Linear" />
              Sign Out
            </Button>
          </div>
        </TabsContent>

        {/* Subscription Tab */}
        {subscription && (
          <TabsContent value="subscription" className="mt-4 space-y-4">
            <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Subscription Details
              </h3>
              <div className="space-y-4">
                <InfoRow
                  icon={<Crown1 size={16} variant="Linear" />}
                  label="Plan"
                  value={planLabel(subscription.plan)}
                  badge={
                    <Badge
                      variant="secondary"
                      className={
                        subscription.status === "active"
                          ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                      }
                    >
                      {subscription.status}
                    </Badge>
                  }
                />
                <Separator />
                <InfoRow
                  icon={<Calendar size={16} variant="Linear" />}
                  label="Start Date"
                  value={formatDate(subscription.startDate)}
                />
                <Separator />
                <InfoRow
                  icon={<Calendar size={16} variant="Linear" />}
                  label="End Date"
                  value={formatDate(subscription.endDate)}
                />
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

/* ── Info Row Component ────────────────────────────────────── */

function InfoRow({
  icon,
  label,
  value,
  badge,
  capitalize,
  muted,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: React.ReactNode;
  capitalize?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">{icon}</span>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p
            className={`text-sm font-medium ${capitalize ? "capitalize" : ""} ${muted ? "text-muted-foreground" : "text-foreground"}`}
          >
            {value}
          </p>
        </div>
      </div>
      {badge}
    </div>
  );
}

/* ── Edit Profile Dialog (React Hook Form + CustomFormField) ── */

const editProfileSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z.string().max(200, "Bio cannot exceed 200 characters").optional(),
});

type EditProfileInput = z.infer<typeof editProfileSchema>;

function EditProfileDialog({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [error, setError] = useState<string | null>(null);

  const info = user.personal_info || user;

  const form = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullname: info.fullname || "",
      username: info.username || "",
      bio: info.bio || "",
    },
    mode: "onChange",
  });

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      const i = user.personal_info || user;
      form.reset({
        fullname: i.fullname || "",
        username: i.username || "",
        bio: i.bio || "",
      });
      setError(null);
    }
    setOpen(isOpen);
  };

  const onSubmit = async (data: EditProfileInput) => {
    setError(null);
    try {
      await updateProfile({
        fullname: data.fullname.trim(),
        username: data.username.trim(),
        bio: data.bio?.trim() || "",
      }).unwrap();
      setOpen(false);
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.data?.error || "Failed to update profile.";
      setError(msg);
    }
  };

  const bioValue = form.watch("bio") || "";

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit2 size={14} variant="Linear" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              control={form.control}
              name="fullname"
              label="Full Name"
              placeholder="Your full name"
              fieldType={FormFieldType.INPUT}
              iconSrc={<User size={18} variant="Linear" />}
            />

            <CustomFormField
              control={form.control}
              name="username"
              label="Username"
              placeholder="your_username"
              fieldType={FormFieldType.INPUT}
              iconSrc={<UserTag size={18} variant="Linear" />}
            />

            <div>
              <CustomFormField
                control={form.control}
                name="bio"
                label="Bio"
                placeholder="Tell us about yourself..."
                fieldType={FormFieldType.TEXTAREA}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {bioValue.length}/200
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
