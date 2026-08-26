"use client";

import { useSyncExternalStore } from "react";
import {
  IDLE_CHANGE_EVENT,
  IDLE_OPTIONS,
  DEFAULT_IDLE_MS,
  idleLockHint,
  readIdleMs,
  writeIdleMs,
} from "@/lib/settings";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(IDLE_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(IDLE_CHANGE_EVENT, onStoreChange);
  };
}

export default function IdleLockSetting() {
  const idleMs = useSyncExternalStore(subscribe, readIdleMs, () => DEFAULT_IDLE_MS);

  return (
    <section className="rounded-2xl border border-wine/8 bg-white px-5 py-6 sm:px-6">
      <h3 className="font-serif text-2xl text-wine">Idle lock</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{idleLockHint(idleMs)}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {IDLE_OPTIONS.map((option) => (
          <button
            key={option.ms}
            type="button"
            aria-pressed={idleMs === option.ms}
            onClick={() => writeIdleMs(option.ms)}
            className={`h-10 rounded-xl px-3.5 text-sm ${
              idleMs === option.ms
                ? "bg-wine font-medium text-ivory"
                : "border border-wine/12 text-wine hover:bg-sand"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
