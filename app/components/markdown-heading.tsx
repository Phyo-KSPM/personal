import {
  createElement,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
} from "react";

const ANCHOR_MARK = /\s*\{#([a-z0-9_-]+)\}\s*$/i;

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(textOf).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textOf(node.props.children);
  }

  return "";
}

function withoutAnchorMark(node: ReactNode): ReactNode {
  if (typeof node === "string") {
    return node.replace(ANCHOR_MARK, "");
  }

  if (Array.isArray(node)) {
    const next = [...node];
    for (let index = next.length - 1; index >= 0; index -= 1) {
      const part = next[index];
      if (typeof part === "string" && ANCHOR_MARK.test(part)) {
        next[index] = part.replace(ANCHOR_MARK, "");
        break;
      }
    }
    return next;
  }

  return node;
}

export function injectHeadingAnchors(markdown: string) {
  return markdown.replace(
    /<a\s+id="([^"]+)"\s*><\/a>\s*(#{1,6})\s+([^\n]+)/gi,
    (_full, id: string, hashes: string, title: string) =>
      `${hashes} ${title} {#${id}}`,
  );
}

export function MarkdownHeading(tag: "h1" | "h2" | "h3" | "h4") {
  return function Heading({
    children,
    ...props
  }: HTMLAttributes<HTMLHeadingElement> & { children?: ReactNode }) {
    const text = textOf(children);
    const marked = text.match(ANCHOR_MARK);
    const id = marked?.[1] ?? props.id;

    return createElement(
      tag,
      { ...props, id },
      marked ? withoutAnchorMark(children) : children,
    );
  };
}
