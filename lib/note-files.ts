import { Document, HeadingLevel, Packer, Paragraph } from "docx";
import mammoth from "mammoth";
import { PDFDocument, StandardFonts } from "pdf-lib";
import WordExtractor from "word-extractor";
import { extractText } from "unpdf";
import {
  isTextNoteExt,
  isWordNoteExt,
  noteFileExt,
  noteFileStem,
  type DownloadFormat,
} from "@/lib/note-file-types";

export {
  DOWNLOAD_FORMATS,
  NOTE_FILE_MAX_BYTES,
  isDownloadFormat,
  isNoteFile,
  noteFileExt,
  noteFileStem,
  type DownloadFormat,
} from "@/lib/note-file-types";

export async function contentFromUpload(file: File) {
  const ext = noteFileExt(file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isTextNoteExt(ext)) {
    return buffer.toString("utf8").trim();
  }

  if (ext === "pdf") {
    const { text } = await extractText(new Uint8Array(buffer), { mergePages: true });
    return text.trim();
  }

  if (isWordNoteExt(ext)) {
    if (ext === "docx") {
      const result = await mammoth.extractRawText({ buffer });
      return result.value.trim();
    }

    const extractor = new WordExtractor();
    const document = await extractor.extract(buffer);
    return document.getBody().trim();
  }

  throw new Error("Unsupported file type.");
}

export async function buildDownload(
  title: string,
  content: string,
  format: DownloadFormat,
): Promise<{ body: Uint8Array; mime: string; filename: string }> {
  const stem = noteFileStem(title);

  if (format === "md") {
    return {
      body: encodeUtf8(content.trim() ? content : `# ${title}\n`),
      mime: "text/markdown; charset=utf-8",
      filename: `${stem}.md`,
    };
  }

  if (format === "txt") {
    return {
      body: encodeUtf8(toPlainText(title, content)),
      mime: "text/plain; charset=utf-8",
      filename: `${stem}.txt`,
    };
  }

  if (format === "pdf") {
    return {
      body: await toPdf(title, content),
      mime: "application/pdf",
      filename: `${stem}.pdf`,
    };
  }

  return {
    body: await toDocx(title, content),
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    filename: `${stem}.docx`,
  };
}

function encodeUtf8(value: string) {
  return new TextEncoder().encode(value);
}

function toPlainText(title: string, content: string) {
  const body = content
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .trim();

  return body ? `${title}\n\n${body}` : title;
}

async function toPdf(title: string, content: string) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const titleFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pageSize = { width: 595.28, height: 841.89 };
  const margin = 56;
  const maxWidth = pageSize.width - margin * 2;
  const bodySize = 11;
  const titleSize = 18;
  const lineHeight = 16;
  const text = toPdfSafe(toPlainText(title, content));
  const [heading, ...rest] = text.split("\n");
  const paragraphs = rest.join("\n").trim();

  let page = pdf.addPage([pageSize.width, pageSize.height]);
  let y = pageSize.height - margin;

  const drawLines = (lines: string[], size: number, face: typeof font) => {
    for (const line of lines) {
      if (y < margin + lineHeight) {
        page = pdf.addPage([pageSize.width, pageSize.height]);
        y = pageSize.height - margin;
      }
      page.drawText(line || " ", {
        x: margin,
        y,
        size,
        font: face,
      });
      y -= lineHeight;
    }
  };

  drawLines(wrapPdfText(heading || title, titleFont, titleSize, maxWidth), titleSize, titleFont);
  y -= 8;
  for (const paragraph of (paragraphs || " ").split(/\n/)) {
    drawLines(wrapPdfText(paragraph, font, bodySize, maxWidth), bodySize, font);
  }

  return pdf.save();
}

function toPdfSafe(text: string) {
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[^\t\n\r\x20-\x7E\xA0-\xFF]/g, "?");
}

function wrapPdfText(
  text: string,
  font: { widthOfTextAtSize: (value: string, size: number) => number },
  size: number,
  maxWidth: number,
) {
  const words = text.split(/(\s+)/);
  const lines: string[] = [];
  let current = "";

  const push = (value: string) => {
    if (value) {
      lines.push(value);
    }
  };

  const splitLong = (value: string) => {
    let chunk = "";
    for (const char of value) {
      const next = chunk + char;
      if (font.widthOfTextAtSize(next, size) > maxWidth && chunk) {
        push(chunk);
        chunk = char;
      } else {
        chunk = next;
      }
    }
    return chunk;
  };

  for (const word of words) {
    if (!word) {
      continue;
    }
    const next = current + word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
      continue;
    }
    push(current.trimEnd());
    current = word.trimStart() ? splitLong(word.trimStart()) : "";
  }

  push(current.trimEnd());
  return lines.length ? lines : [""];
}

async function toDocx(title: string, content: string) {
  const children = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
    }),
  ];

  for (const line of content.replace(/\r\n/g, "\n").split("\n")) {
    if (line.startsWith("### ")) {
      children.push(
        new Paragraph({ text: line.slice(4), heading: HeadingLevel.HEADING_3 }),
      );
      continue;
    }
    if (line.startsWith("## ")) {
      children.push(
        new Paragraph({ text: line.slice(3), heading: HeadingLevel.HEADING_2 }),
      );
      continue;
    }
    if (line.startsWith("# ")) {
      children.push(
        new Paragraph({ text: line.slice(2), heading: HeadingLevel.HEADING_1 }),
      );
      continue;
    }
    children.push(new Paragraph({ text: line || " " }));
  }

  const document = new Document({
    sections: [{ children }],
  });

  return Packer.toBuffer(document);
}
