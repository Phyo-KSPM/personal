export const IDLE_STORAGE_KEY = "kophyo-idle-ms";
export const IDLE_CHANGE_EVENT = "kophyo-idle-change";
export const DEFAULT_IDLE_MS = 5 * 60 * 1000;

export const IDLE_OPTIONS = [
  { ms: 0, label: "Off" },
  { ms: 60 * 1000, label: "1 min" },
  { ms: 5 * 60 * 1000, label: "5 min" },
  { ms: 15 * 60 * 1000, label: "15 min" },
  { ms: 30 * 60 * 1000, label: "30 min" },
] as const;

export type IdleMs = (typeof IDLE_OPTIONS)[number]["ms"];

export function isIdleMs(value: number): value is IdleMs {
  return IDLE_OPTIONS.some((option) => option.ms === value);
}

export function parseIdleMs(value: string | null): IdleMs {
  if (value == null) {
    return DEFAULT_IDLE_MS;
  }

  const parsed = Number(value);
  return isIdleMs(parsed) ? parsed : DEFAULT_IDLE_MS;
}

export function readIdleMs(): IdleMs {
  if (typeof window === "undefined") {
    return DEFAULT_IDLE_MS;
  }

  return parseIdleMs(window.localStorage.getItem(IDLE_STORAGE_KEY));
}

export function writeIdleMs(ms: IdleMs) {
  window.localStorage.setItem(IDLE_STORAGE_KEY, String(ms));
  window.dispatchEvent(new Event(IDLE_CHANGE_EVENT));
}

export function idleLockHint(ms: IdleMs) {
  if (ms === 0) {
    return "The workspace stays open until you sign out.";
  }

  const minutes = ms / 60_000;
  const unit = minutes === 1 ? "minute" : "minutes";
  return `Signs out after ${minutes} ${unit} without activity.`;
}
