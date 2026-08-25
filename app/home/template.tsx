"use client";

import PageFade from "@/app/components/page-fade";
import type { ReactNode } from "react";

export default function HomeTemplate({ children }: { children: ReactNode }) {
  return <PageFade className="flex min-h-0 flex-1 flex-col">{children}</PageFade>;
}
