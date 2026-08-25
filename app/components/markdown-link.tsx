"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

export default function MarkdownLink({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!href?.startsWith("#")) {
      return;
    }

    const id = decodeURIComponent(href.slice(1));
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", href);
  }

  if (href?.startsWith("http://") || href?.startsWith("https://")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  );
}
