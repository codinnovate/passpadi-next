"use client";

const rawServerUrl = (process.env.NEXT_PUBLIC_SERVER || "").trim();
const serverUrl = rawServerUrl.replace(/\/+$/, "");
const visitorStorageKey = "admission_tracking_visitor_id";
const sessionStorageKey = "admission_tracking_session_id";

const apiUrl = (path: string) => `${serverUrl}${path.startsWith("/") ? path : `/${path}`}`;

export type AdmissionTrackingContext = {
  visitorId: string;
  sessionId: string;
  pageUrl: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

export type AdmissionTrackingPayload = {
  eventName: string;
  stepIndex?: number;
  stepKey?: string;
  stepTitle?: string;
  metadata?: Record<string, unknown>;
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const getAdmissionTrackingContext = (): AdmissionTrackingContext | null => {
  if (typeof window === "undefined") return null;

  let visitorId = window.localStorage.getItem(visitorStorageKey);
  if (!visitorId) {
    visitorId = createId();
    window.localStorage.setItem(visitorStorageKey, visitorId);
  }

  let sessionId = window.sessionStorage.getItem(sessionStorageKey);
  if (!sessionId) {
    sessionId = createId();
    window.sessionStorage.setItem(sessionStorageKey, sessionId);
  }

  const searchParams = new URLSearchParams(window.location.search);

  return {
    visitorId,
    sessionId,
    pageUrl: window.location.href,
    referrer: document.referrer || "",
    utmSource: searchParams.get("utm_source") || "",
    utmMedium: searchParams.get("utm_medium") || "",
    utmCampaign: searchParams.get("utm_campaign") || "",
  };
};

export const trackAdmissionEvent = (
  payload: AdmissionTrackingPayload,
  options?: { beacon?: boolean }
) => {
  const context = getAdmissionTrackingContext();
  if (!context || !serverUrl) return;

  const body = JSON.stringify({
    ...context,
    ...payload,
    metadata: payload.metadata || {},
  });

  const url = apiUrl("/api/v1/admission-tracking/events");

  if (options?.beacon && "sendBeacon" in navigator) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(url, blob);
    return;
  }

  void fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  }).catch(() => {
    // Tracking should never block the admission flow.
  });
};

export type SyncPremiumFunnelProgressParams = {
  funnelSource: string;
  funnelStepIndex?: number;
  funnelStepKey?: string;
  funnelStepTitle?: string;
  name?: string;
  email?: string;
  phone?: string;
  jambScore?: string;
  course?: string;
  school?: string;
  note?: string;
  receiveAdmissionUpdates?: boolean;
  writingPostUtme?: boolean;
};

/** Persists partial funnel answers on the session document (before payment / lead). */
export const syncPremiumFunnelProgress = (params: SyncPremiumFunnelProgressParams) => {
  const context = getAdmissionTrackingContext();
  if (!context || !serverUrl) return;

  const body: Record<string, unknown> = {
    visitorId: context.visitorId,
    funnelSource: params.funnelSource,
    pageUrl: context.pageUrl,
    referrer: context.referrer,
    utmSource: context.utmSource || undefined,
    utmMedium: context.utmMedium || undefined,
    utmCampaign: context.utmCampaign || undefined,
  };

  if (params.funnelStepIndex !== undefined) {
    body.funnelStepIndex = params.funnelStepIndex;
  }

  if (params.funnelStepKey) {
    body.funnelStepKey = params.funnelStepKey;
  }

  if (params.funnelStepTitle) {
    body.funnelStepTitle = params.funnelStepTitle;
  }

  if (params.name?.trim()) {
    body.name = params.name.trim();
  }

  if (params.email?.trim()) {
    body.email = params.email.trim();
  }

  if (params.phone?.trim()) {
    body.phone = params.phone.trim();
  }

  if (params.jambScore?.trim()) {
    body.jambScore = params.jambScore.trim();
  }

  if (params.course?.trim()) {
    body.course = params.course.trim();
  }

  if (params.school?.trim()) {
    body.school = params.school.trim();
  }

  if (params.note?.trim()) {
    body.note = params.note.trim();
  }

  if (params.receiveAdmissionUpdates !== undefined) {
    body.receiveAdmissionUpdates = params.receiveAdmissionUpdates;
  }

  if (params.writingPostUtme !== undefined) {
    body.writingPostUtme = params.writingPostUtme;
  }

  void fetch(apiUrl(`/api/v1/admission-tracking/sessions/${encodeURIComponent(context.sessionId)}/progress`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // Same as events: never block UX.
  });
};

/** Upserts the tracking session as soon as the user hits the premium page (ids live in localStorage / sessionStorage). */
export const persistPremiumLandingSession = () => {
  syncPremiumFunnelProgress({
    funnelSource: "premium_landing",
    funnelStepIndex: 0,
    funnelStepKey: "premium_page",
    funnelStepTitle: "Premium admission page",
  });
};
