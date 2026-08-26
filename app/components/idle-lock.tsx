"use client";

import { useEffect, useRef } from "react";
import { signOut } from "@/app/actions/auth";
import { IDLE_CHANGE_EVENT, readIdleMs } from "@/lib/settings";

export default function IdleLock() {
  const lastActiveAt = useRef(Date.now());
  const idleMs = useRef(readIdleMs());

  useEffect(() => {
    const bump = () => {
      lastActiveAt.current = Date.now();
    };

    const syncIdleMs = () => {
      idleMs.current = readIdleMs();
    };

    const lockIfIdle = () => {
      if (idleMs.current <= 0) {
        return;
      }

      if (Date.now() - lastActiveAt.current >= idleMs.current) {
        void signOut();
      }
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ] as const;

    events.forEach((event) => {
      window.addEventListener(event, bump, { passive: true });
    });

    window.addEventListener("storage", syncIdleMs);
    window.addEventListener(IDLE_CHANGE_EVENT, syncIdleMs);

    const interval = window.setInterval(lockIfIdle, 10_000);
    document.addEventListener("visibilitychange", lockIfIdle);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, bump);
      });
      window.removeEventListener("storage", syncIdleMs);
      window.removeEventListener(IDLE_CHANGE_EVENT, syncIdleMs);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", lockIfIdle);
    };
  }, []);

  return null;
}
