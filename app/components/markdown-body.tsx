import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CopyablePre from "@/app/components/copyable-pre";
import { injectHeadingAnchors, MarkdownHeading } from "@/app/components/markdown-heading";
import MarkdownLink from "@/app/components/markdown-link";

export default function MarkdownBody({ content }: { content: string }) {
  return (
    <div className="note-markdown">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: CopyablePre,
          a: MarkdownLink,
          h1: MarkdownHeading("h1"),
          h2: MarkdownHeading("h2"),
          h3: MarkdownHeading("h3"),
          h4: MarkdownHeading("h4"),
        }}
      >
        {injectHeadingAnchors(content)}
      </Markdown>
    </div>
  );
}
