"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu } from "lucide-react";
import Logo from "@/src/assets/logo2.png";
import { Button } from "@/components/ui/button";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useAppSelector } from "@/redux/hooks";

const Navbar = () => {
    const token = useAppSelector((state) => state.auth.token);
    const { data: userData, isLoading } = useGetMeQuery(undefined, { skip: !token });
    const user = (userData as any)?.data;

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Process", href: "#how-it-works" },
    ];

    return (
        <header className="w-full bg-[#0a1628]/95 text-white fixed top-0 z-[100] border-b border-white/10 backdrop-blur-xl transition-all duration-300">
            <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-110">
                        <Image
                            src={Logo.src}
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-lg md:text-xl font-black tracking-tight text-white uppercase italic hidden sm:block">
                        SmartAuto<span className="text-blue-500">Tech</span>
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name}
                            href={link.href}
                            className="text-[13px] font-bold text-gray-400 hover:text-white transition-all uppercase tracking-widest"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions: Login & Get Started */}
                <div className="flex items-center gap-4 md:gap-8">
                    {!isLoading && !user && (
                        <Link 
                            href="/login" 
                            className="text-[11px] md:text-[12px] font-black text-white/70 hover:text-white transition-all uppercase tracking-[0.2em] border-r border-white/10 pr-6 mr-1 hidden sm:block"
                        >
                             Existing User? <span className="text-blue-400 ml-1">Login</span>
                        </Link>
                    )}
                    
                    {!isLoading && !user && (
                        <Link href="/login" className="sm:hidden text-[11px] font-black text-blue-400 uppercase tracking-widest">
                            Login
                        </Link>
                    )}
                    
                    {isLoading ? (
                        <div className="w-24 md:w-32 h-10 md:h-12 bg-white/5 animate-pulse rounded-full" />
                    ) : user ? (
                        <Link href={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}>
                             <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 md:px-10 py-4 md:py-6 font-black flex items-center gap-2 text-[12px] md:text-[13px] uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                                Go to Dashboard <ArrowUpRight className="w-4 h-4" />
                             </Button>
                        </Link>
                    ) : (
                        <Link href="/shop-onboarding">
                            <Button className="bg-white hover:bg-white/90 text-[#0a1628] rounded-full px-6 md:px-10 py-4 md:py-6 font-black flex items-center gap-2 text-[12px] md:text-[13px] uppercase tracking-widest shadow-2xl transition-all active:scale-95">
                                Join Now <ArrowUpRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    )}

                    {/* Mobile Menu Icon */}
                    <button className="lg:hidden p-2 text-white/70 hover:text-white transition-colors">
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
