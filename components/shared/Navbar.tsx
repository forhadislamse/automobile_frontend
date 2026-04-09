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
        { name: "How it works", href: "#how-it-works" },
    ];

    return (
        <header className="w-full bg-[#0a1628] text-white fixed top-0 z-50 border-b border-white/5 backdrop-blur-md bg-opacity-95">
            <div className="container mx-auto px-6 h-20 md:h-24 flex justify-between items-center">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-105">
                        <Image
                            src={Logo.src}
                            alt="SmartAutoTech AI Logo"
                            fill
                            className="object-contain brightness-0 invert"
                        />
                    </div>
                    <span className="text-xl md:text-2xl font-black tracking-tight text-white uppercase italic">
                        SmartAuto<span className="text-blue-500">Tech</span>
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name}
                            href={link.href}
                            className="text-[15px] font-medium text-gray-300 hover:text-white transition-colors tracking-wide"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions: Login & Get Started */}
                <div className="flex items-center gap-6">
                    {!isLoading && !user && (
                        <Link href="/login" className="hidden md:block text-[15px] font-semibold text-gray-300 hover:text-white transition-colors pr-2">
                             Login
                        </Link>
                    )}
                    
                    {isLoading ? (
                        <div className="w-32 h-12 bg-white/10 animate-pulse rounded-full" />
                    ) : user ? (
                        <Link href={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}>
                             <Button className="bg-[#0f172a] border border-white/20 hover:bg-white/10 text-white rounded-full px-8 py-6 font-bold flex items-center gap-2 text-[15px]">
                                Dashboard <ArrowUpRight className="w-4 h-4" />
                             </Button>
                        </Link>
                    ) : (
                        <Link href="/signup">
                            <Button className="bg-[#0f172a] border-2 border-white/10 hover:border-white/40 hover:bg-white/5 text-white rounded-full px-8 py-6 font-bold flex items-center gap-2 text-[15px] transition-all">
                                Get started <ArrowUpRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    )}

                    {/* Mobile Menu Icon */}
                    <div className="lg:hidden">
                         <Button variant="ghost" size="icon" className="text-white">
                             <Menu className="w-6 h-6" />
                         </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
