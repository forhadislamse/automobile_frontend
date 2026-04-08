"use client";

import { useGetAllChaptersQuery } from "@/redux/api/guideApi";
import { useGetMeQuery, useLogoutMutation } from "@/redux/api/authApi";
import {
    Search,
    ChevronDown,
    ChevronRight,
    Lock,
    BookOpen,
    User,
    Menu,
    Settings,
    UserCircle,
    LogOut as LogOutIcon
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { baseApi } from "@/redux/api/baseApi";

export default function ReaderSidebar() {
    const pathname = usePathname();
    const params = useParams();
    const { data: chapters, isLoading } = useGetAllChaptersQuery(undefined);
    const { data: userData } = useGetMeQuery(undefined);
    const user = (userData as any)?.data;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [logoutMutation] = useLogoutMutation();
    const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Auto-expand the chapter if we are in a section of that chapter
    useEffect(() => {
        if (params.id && chapters?.data) {
            // Find the chapter that contains this section
            const chapterWithSection = chapters.data.find((ch: any) =>
                ch.sections.some((sec: any) => sec.id === params.id)
            );
            if (chapterWithSection && !expandedChapters.includes(chapterWithSection.id)) {
                setExpandedChapters(prev => [...prev, chapterWithSection.id]);
            }
        }
    }, [params.id, chapters?.data]);

    const toggleChapter = (chapterId: string) => {
        setExpandedChapters(prev =>
            prev.includes(chapterId)
                ? prev.filter(id => id !== chapterId)
                : [...prev, chapterId]
        );
    };

    const handleLogout = async () => {
        try {
            await logoutMutation({}).unwrap();
        } catch (err) {
            console.error("Logout failed", err);
        }
        dispatch(logout());
        dispatch(baseApi.util.resetApiState());
        router.push("/");
    };

    const filteredChapters = chapters?.data?.filter((chapter: any) =>
        chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.number.toString().includes(searchQuery)
    );

    return (
        <aside className="w-80 h-screen border-r border-gray-100 bg-white flex flex-col fixed left-0 top-0 z-50 shadow-sm">
            {/* Logo Section */}
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
                <Link href="/" className="flex items-center gap-3">
                    <div className="bg-[#0f172a] p-1.5 rounded-lg">
                        <Image src="/logo2.png" alt="Cates Logo" width={24} height={24} className="brightness-200" />
                    </div>
                    <div>
                        <span className="font-bold text-[#0F172A] text-lg tracking-tight block leading-none">CATES</span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">Legal Group</span>
                    </div>
                </Link>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Search Section */}
            <div className="px-4 py-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search rules, annotations or..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border border-transparent rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 overflow-y-auto px-3 space-y-1 py-2 custom-scrollbar">
                {isLoading ? (
                    <div className="space-y-4 p-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-4 bg-gray-50 rounded animate-pulse" />
                        ))}
                    </div>
                ) : (
                    filteredChapters?.map((chapter: any) => {
                        const isExpanded = expandedChapters.includes(chapter.id);
                        const isChapterInView = params.id && chapter.sections.some((s: any) => s.id === params.id);

                        return (
                            <div key={chapter.id} className="mb-1">
                                <button
                                    onClick={() => toggleChapter(chapter.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isChapterInView ? "text-blue-600" : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <BookOpen className={`w-4 h-4 shrink-0 ${isChapterInView ? "text-blue-600" : "text-gray-400"}`} />
                                    <span className="flex-1 text-left truncate">Chapter {chapter.number}</span>
                                    {chapter.isLocked && <Lock className="w-3.5 h-3.5 text-gray-300 mr-1" />}
                                    {isExpanded ?
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isChapterInView ? "text-blue-500" : "text-gray-400"}`} /> :
                                        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                                    }
                                </button>

                                {isExpanded && (
                                    <div className="mt-1 ml-4 border-l-2 border-gray-50 pl-2 py-1 space-y-0.5 animate-in slide-in-from-left-2 duration-200">
                                        {(() => {
                                            const grouped = chapter.sections?.reduce((acc: any, section: any) => {
                                                const sub = section.subChapter || "_NONE_";
                                                if (!acc[sub]) acc[sub] = [];
                                                acc[sub].push(section);
                                                return acc;
                                            }, {});

                                            return grouped && Object.entries(grouped).map(([subTitle, subSections]: [string, any]) => (
                                                <div key={subTitle} className="space-y-1 pt-2 first:pt-0">
                                                    {subTitle !== "_NONE_" && (
                                                        <div className="px-4 py-1.5">
                                                            <h5 className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] leading-none">
                                                                {subTitle}
                                                            </h5>
                                                        </div>
                                                    )}
                                                    {subSections.map((section: any) => {
                                                        const isActive = params.id === section.id;
                                                        return (
                                                            <Link
                                                                key={section.id}
                                                                href={`/user/reader/section/${section.id}`}
                                                                className={`group flex items-center gap-3 px-4 py-2 rounded-lg text-[13px] transition-all relative ${isActive
                                                                        ? "bg-gray-100 text-gray-900 font-bold shadow-sm"
                                                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                                                                    }`}
                                                            >
                                                                {isActive && (
                                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3.5 bg-[#0F172A] rounded-full" />
                                                                )}
                                                                <span className={`shrink-0 font-bold ${isActive ? "text-[#0F172A]" : "text-gray-400 font-mono text-[10px]"}`}>
                                                                    {section.number}
                                                                </span>
                                                                <span className="truncate flex-1">{section.title}</span>
                                                                {section.isLocked && <Lock className="w-2.5 h-2.5 ml-auto text-gray-200 group-hover:text-gray-300 transition-colors" />}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-gray-50 bg-[#F8FAFC]">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 p-2 group cursor-pointer hover:bg-white hover:shadow-sm rounded-xl transition-all">
                            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center bg-white relative">
                                <Image src="/logo2.png" alt="User" width={40} height={40} className="object-cover scale-110 opacity-80" />
                                <div className="absolute inset-0 bg-blue-600/10" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="block font-bold text-gray-900 text-sm truncate leading-none mb-1">
                                    {user?.fullName || "User"}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${user?.isSubscribed ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-gray-300"}`} />
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                        {user?.isSubscribed ? (user?.plan?.name || "Active Plan") : "Free Plan"}
                                    </span>
                                </span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 mb-4" align="start" side="top">
                        <Link href="/user/dashboard/profile">
                            <DropdownMenuItem className="cursor-pointer">
                                <UserCircle className="mr-2 h-4 w-4" />
                                <span>Update Profile</span>
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                            <LogOutIcon className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }
            `}</style>
        </aside>
    );
}

