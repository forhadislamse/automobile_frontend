import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const fileName = "SmartAutoTech Quick Start Guide.pdf";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", fileName);
  const file = await readFile(filePath);

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
