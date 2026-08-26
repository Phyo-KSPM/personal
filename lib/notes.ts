export const TOPICS = [
  {
    slug: "network",
    label: "Network",
    hint: "DNS, routing, firewalls",
  },
  {
    slug: "system",
    label: "System",
    hint: "Linux, servers, hardware",
  },
  {
    slug: "devops",
    label: "DevOps",
    hint: "Nginx, CI, containers",
  },
  {
    slug: "software",
    label: "Software",
    hint: "Code, apps, languages",
  },
] as const;

export type TopicSlug = (typeof TOPICS)[number]["slug"];

export type Note = {
  id: string;
  title: string;
  content: string;
  category: TopicSlug;
  created_at: string;
  updated_at: string;
};

export type NoteSummary = {
  id: string;
  title: string;
  category: TopicSlug;
  created_at?: string;
  updated_at: string;
};

export function isTopicSlug(value: string): value is TopicSlug {
  return TOPICS.some((topic) => topic.slug === value);
}

export function parseTopic(value: FormDataEntryValue | string | null | undefined): TopicSlug {
  const slug = String(value ?? "").trim();
  return isTopicSlug(slug) ? slug : "software";
}

export function topicLabel(slug: TopicSlug) {
  return TOPICS.find((topic) => topic.slug === slug)?.label ?? "Software";
}

export function topicPath(slug?: TopicSlug) {
  return slug ? `/home/c/${slug}` : "/home";
}

export function topicNewPath(slug: TopicSlug) {
  return `${topicPath(slug)}?add=1`;
}

export function isNotesSchemaError(message?: string | null) {
  return Boolean(
    message &&
      /schema cache|does not exist|could not find the table|column .* (title|category)/i.test(
        message,
      ),
  );
}

export function titleFromMarkdown(filename: string, content: string) {
  const heading = content.match(/^#\s+(.+)$/m);
  if (heading?.[1]) {
    return heading[1].trim();
  }

  const fromName = filename
    .replace(/\.(md|txt)$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();

  return fromName || "Untitled note";
}

export function isNoteFile(file: File) {
  const name = file.name.toLowerCase();
  return name.endsWith(".md") || name.endsWith(".txt");
}
