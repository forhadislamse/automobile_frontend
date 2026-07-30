import AdminOtp from "@/components/module/AdminAuth/otp";
import Image from "next/image";

export default function ResetPassword() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/Lo.png')" }}
    >
      {/* Centered Card */}
      <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-8 w-full max-w-2xl mx-4">
        <Image
          src="/r_logo.png"
          alt="SmartAuto Logo"
          width={200}
          height={200}
          className="h-52 w-52 flex items-center justify-center mx-auto"
        />

        <AdminOtp />
      </div>
    </div>
  );
}
