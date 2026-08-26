import { NextResponse } from "next/server";
import { getAuthUser, getNoteById } from "@/lib/data/notes";
import { buildDownload } from "@/lib/note-files";
import { isDownloadFormat } from "@/lib/note-file-types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { id } = await params;
  const note = await getNoteById(id);
  if (!note) {
    return new NextResponse("Note not found", { status: 404 });
  }

  const format = new URL(request.url).searchParams.get("format");
  if (!isDownloadFormat(format)) {
    return new NextResponse("Choose Markdown, text, PDF, or Word.", { status: 400 });
  }

  const file = await buildDownload(note.title, note.content, format);
  const asciiName = file.filename.replace(/[^\x20-\x7E]/g, "_");

  return new NextResponse(Buffer.from(file.body), {
    headers: {
      "Content-Type": file.mime,
      "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
      "Cache-Control": "no-store",
    },
  });
}
