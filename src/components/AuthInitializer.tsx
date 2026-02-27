"use client";

import { useGetProfileQuery } from "@/store/api";

export default function AuthInitializer() {
  // Fires on mount — restores auth state from the HTTP-only cookie session
  useGetProfileQuery();
  return null;
}
