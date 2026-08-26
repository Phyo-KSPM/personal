export const NOTE_FILE_MAX_BYTES = 8 * 1024 * 1024;

export const DOWNLOAD_FORMATS = [
  { id: "md", label: "Markdown", ext: "md" },
  { id: "txt", label: "Text", ext: "txt" },
  { id: "pdf", label: "PDF", ext: "pdf" },
  { id: "docx", label: "Word", ext: "docx" },
] as const;

export type DownloadFormat = (typeof DOWNLOAD_FORMATS)[number]["id"];

const TEXT_EXT = new Set(["md", "txt"]);
const WORD_EXT = new Set(["doc", "docx"]);

export function noteFileExt(name: string) {
  const match = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match?.[1] ?? "";
}

export function isNoteFile(file: File) {
  const ext = noteFileExt(file.name);
  return TEXT_EXT.has(ext) || ext === "pdf" || WORD_EXT.has(ext);
}

export function isDownloadFormat(value: string | null): value is DownloadFormat {
  return DOWNLOAD_FORMATS.some((format) => format.id === value);
}

export function noteFileStem(title: string) {
  return title.replace(/[^\w\s-]+/g, "").trim() || "note";
}

export function isTextNoteExt(ext: string) {
  return TEXT_EXT.has(ext);
}

export function isWordNoteExt(ext: string) {
  return WORD_EXT.has(ext);
}
