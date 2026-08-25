"use client";

import { useEffect, useRef } from "react";
import { signOut } from "@/app/actions/auth";

const IDLE_MS = 5 * 60 * 1000;

export default function IdleLock() {
  const lastActiveAt = useRef(Date.now());

  useEffect(() => {
    const bump = () => {
      lastActiveAt.current = Date.now();
    };

    const lockIfIdle = () => {
      if (Date.now() - lastActiveAt.current >= IDLE_MS) {
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

    const interval = window.setInterval(lockIfIdle, 10_000);
    document.addEventListener("visibilitychange", lockIfIdle);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, bump);
      });
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", lockIfIdle);
    };
  }, []);

  return null;
}
