"use client";

import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { LogoIcon } from "@/components/shared/LogoIcon";
import { Button } from "@/components/ui/button";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useAppSelector } from "@/redux/hooks";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/authSlice";

const Navbar = () => {
    const dispatch = useDispatch();
    const token = useAppSelector((state) => state.auth.token);
    const { data: userData, isLoading } = useGetMeQuery(undefined, { skip: !token });
    const user = token ? (userData as any)?.data : null;

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "How it works", href: "#how-it-works" },
    ];

    return (
        <header className="w-full bg-white/90 text-gray-900 fixed top-0 z-[100] border-b border-gray-200 backdrop-blur-xl transition-all duration-300">
            <div className="container mx-auto px-4 md:px-6 h-20 md:h-24 flex justify-between items-center">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className="transition-transform group-hover:scale-105">
                        <LogoIcon className="w-10 h-10 md:w-12 md:h-12" />
                    </div>
                    <span className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 hidden sm:block">
                        NextGen <span className="text-[#FF6B00]">AutoTech</span>
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name}
                            href={link.href}
                            className="text-[15px] font-medium text-gray-600 hover:text-[#FF6B00] transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions: Login & Get Started */}
                <div className="flex items-center gap-6 md:gap-8">
                    {isLoading ? (
                        <div className="w-32 h-12 bg-gray-100 animate-pulse rounded-xl" />
                    ) : user ? (
                        <>
                            <button 
                                onClick={() => dispatch(logout())}
                                className="text-[15px] font-bold text-gray-700 hover:text-rose-500 transition-colors hidden sm:block"
                            >
                                Logout
                            </button>
                            <Link href={user.role === "ADMIN" ? "/admin/dashboard" : user.role === "TECHNICIAN" ? "/user/diagnostics" : "/user"}>
                                 <Button className="bg-[#FF6B00] hover:bg-[#E66000] text-white rounded-xl px-8 py-6 font-bold flex items-center gap-2 text-[15px] shadow-lg shadow-orange-500/25 active:scale-95 transition-all">
                                    Dashboard <ArrowUpRight className="w-5 h-5" />
                                 </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link 
                                href="/login" 
                                className="text-[15px] font-bold text-gray-700 hover:text-[#FF6B00] transition-colors hidden sm:block"
                            >
                                 Login
                            </Link>
                            
                            <Link href="/login" className="sm:hidden text-[14px] font-bold text-[#FF6B00]">
                                Login
                            </Link>
                            
                            <Link href="/register">
                                <Button className="bg-[#1F2937] hover:bg-black text-white rounded-xl px-8 py-6 font-bold flex items-center gap-2 text-[15px] shadow-xl transition-all active:scale-95">
                                    Get started <ArrowUpRight className="w-5 h-5" />
                                </Button>
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu Icon */}
                    <button className="lg:hidden p-2 text-gray-600 hover:text-[#FF6B00] transition-colors">
                        <Menu size={28} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

