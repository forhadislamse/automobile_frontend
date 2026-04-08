"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Phone, User } from "lucide-react";
import Logo from "@/src/assets/logo2.png";
import { Button } from "@/components/ui/button";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useAppSelector } from "@/redux/hooks";

const Navbar = () => {
    const token = useAppSelector((state) => state.auth.token);
    const { data: userData, isLoading } = useGetMeQuery(undefined, { skip: !token });
    const user = (userData as any)?.data;

    return (
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">
            {/* Top Bar */}
            <div className="w-full bg-[#1E293B] text-white py-2 px-6">
                <div className="container mx-auto flex justify-between items-center text-xs md:text-sm font-medium">
                    <div className="flex items-center gap-4">
                        <Link href="https://twitter.com" target="_blank" className="hover:text-blue-400 transition-colors">
                            <Twitter size={14} />
                        </Link>
                        <Link href="https://linkedin.com" target="_blank" className="hover:text-blue-400 transition-colors">
                            <Linkedin size={14} />
                        </Link>
                    </div>
                    
                    <div className="flex items-center gap-2 italic">
                        <Phone size={14} className="text-blue-400" />
                        <span>Call Today : 512-426-4593</span>
                    </div>

                    <div className="hidden md:block">
                        <span className="text-gray-400 italic">Trusted Legal Excellence</span>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="border-b border-gray-100">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-12 h-12 md:w-16 md:h-16 transition-transform group-hover:scale-105">
                            <Image
                                src={Logo.src}
                                alt="Texas Law Books Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl font-bold  text-[#1E293B] leading-none">TEXAS LAW</span>
                            <span className="text-xs md:text-sm text-blue-600 font-bold tracking-widest uppercase">Books</span>
                        </div>
                    </Link>

                    {/* Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-[#1E293B] font-semibold hover:text-blue-600 transition-colors uppercase text-sm tracking-wide">
                            Home
                        </Link>
                        <Link href="/user/reader" className="text-[#1E293B] font-semibold hover:text-blue-600 transition-colors uppercase text-sm tracking-wide">
                            Guide Reader
                        </Link>
                        <Link href="/about" className="text-[#1E293B] font-semibold hover:text-blue-600 transition-colors uppercase text-sm tracking-wide">
                            About
                        </Link>
                        
                        {isLoading ? (
                            <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-lg" />
                        ) : user ? (
                            <Link href={user.role === "ADMIN" ? "/admin/dashboard" : "/user/reader"}>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 font-bold uppercase text-xs tracking-widest">
                                    <User size={14} className="mr-2" /> {user.fullName || "Account"}
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 font-bold uppercase text-xs tracking-widest">
                                    <User size={14} className="mr-2" /> Login
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button Placeholder */}
                    <div className="md:hidden">
                         <Button variant="ghost" size="icon">
                             <span className="sr-only">Open menu</span>
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                             </svg>
                         </Button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
