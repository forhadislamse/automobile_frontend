import Otp from "@/components/module/Auth/otp";
import Image from "next/image";

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-1/2 border-r border-slate-200 relative flex flex-col justify-between bg-[url('/Lo.png')] bg-cover bg-center">
        <div className="relative z-10">
          <div className="mb-8 flex justify-center">
            <Image
              src="/r_logo.png"
              alt="SmartAuto Logo"
              width={200}
              height={200}
              className="h-52 w-52"
            />
          </div>
        </div>

        <div className="relative z-10 flex justify-between">
          <Image
            src="/images/Typing.png"
            alt="SmartAuto Logo"
            width={12000}
            height={12000}
            className="object-cover  rounded-lg"
            priority
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <Otp />
      </div>
    </div>
  );
}
