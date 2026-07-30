import TechnicianCard from "@/components/module/Chat/UserCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 px-4">
      <Button>
        <ArrowLeft className="mr-2 h-4 w-4" /> <Link href="/chat">Go Back</Link>
      </Button>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <TechnicianCard />
        </div>
      </div>
    </div>
  );
};

export default Page;
