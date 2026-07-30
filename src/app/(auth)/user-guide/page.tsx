import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import UserGuidePreview from "@/components/module/Auth/UserGuidePreview";

export default function UserGuidePage() {
  return (
    <main className="min-h-screen bg-white p-3 sm:p-4 md:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-6xl flex-col gap-4 sm:min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quick Start Guide</h1>
            <p className="text-sm text-slate-500">
              A guide for better diagnostics
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:flex sm:items-center">
            <Link href="/login">
              <Button variant="outline" className="w-full gap-2 sm:w-auto">
                <ArrowLeft size={16} />
                Back to Login
              </Button>
            </Link>
            <Link
              href="/api/user-guide/download"
              download="SmartAutoTech Quick Start Guide.pdf"
            >
              <Button className="w-full gap-2 sm:w-auto">
                <Download size={16} />
                Download
              </Button>
            </Link>
          </div>
        </div>

        <UserGuidePreview />
      </div>
    </main>
  );
}
