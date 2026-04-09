import Otp from "@/components/module/Auth/otp";

export default function OtpVerificationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex w-full max-w-6xl items-center gap-10 lg:gap-24">
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-[#0a1628] rounded-[2.5rem] min-h-[85vh] relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-3xl animate-pulse" />
          <div className="relative z-10 text-center animate-in fade-in zoom-in duration-700">
             <Image
                src="/logo2.png"
                alt="Logo"
                width={280}
                height={280}
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="mt-8">
                 <h2 className="text-white text-3xl font-black tracking-tighter uppercase italic">
                   SmartAuto<span className="text-blue-500">Tech</span>
                 </h2>
                 <p className="text-gray-400 font-medium tracking-[0.3em] text-[10px] mt-2">AI DRIVEN DIAGNOSTICS</p>
              </div>
          </div>
        </div>

        {/* Right Side: OTP Component */}
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-500">
          <Otp />
        </div>
      </div>
    </div>
  );
}
