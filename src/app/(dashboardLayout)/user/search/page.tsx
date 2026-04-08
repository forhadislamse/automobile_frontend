"use client";

import { useSearchGuideQuery } from "@/redux/api/guideApi";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronRight, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q") || "";
    const [searchTerm, setSearchTerm] = useState(query);

    const highlightText = (text: string, term: string) => {
        if (!term || !text) return text;
        const parts = String(text).split(new RegExp(`(${term})`, "gi"));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === term.toLowerCase() ? (
                        <mark key={i} className="bg-blue-100 text-blue-900 rounded-sm px-0.5 font-medium">
                            {part}
                        </mark>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    const { data: searchResults, isLoading, error } = useSearchGuideQuery(
        { searchTerm: query, limit: 20 },
        { skip: !query }
    );

    if ((error as any)?.status === 402 || (error as any)?.status === 403) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                    <Lock className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight">Premium feature locked</h2>
                <p className="text-gray-500 max-w-md mb-10 text-lg italic leading-relaxed">
                    The precision search feature is part of our premium legal guide. Subscribe to a plan to unlock full search capabilities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/">
                        <Button size="lg" className="bg-[#0F172A] hover:bg-gray-800 text-white px-8 py-6 rounded-2xl font-bold uppercase tracking-widest shadow-xl">
                            View Pricing Plans
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/user/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 ">Search the Guide</h1>
                <form onSubmit={handleSearch} className="relative max-w-2xl">
                    <Input
                        type="text"
                        placeholder="Search rules, annotations, or case law..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 py-6 text-lg rounded-xl border-blue-100 shadow-sm focus:ring-blue-500"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </form>
            </header>

            <div className="space-y-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-gray-500 italic">Searching the legal database...</p>
                    </div>
                ) : !query ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">Enter a keyword above to start searching.</p>
                    </div>
                ) : searchResults?.data?.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl">
                        <p className="text-gray-900 font-bold text-xl mb-2">No results found for "{query}"</p>
                        <p className="text-gray-500">Try using more general keywords or section numbers.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 mb-4">
                            Found {searchResults?.meta?.total || 0} results for "{query}"
                        </p>
                        <div className="grid gap-4">
                            {searchResults?.data?.map((result: any) => (
                                <Link key={result.id} href={`/user/reader/section/${result.id}`}>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-100 mb-2">
                                                    Sec. {highlightText(result.number, query)}
                                                </Badge>
                                                <h3 className="text-xl font-bold text-gray-900 ">
                                                    {highlightText(result.title, query)}
                                                </h3>
                                            </div>
                                            <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-2" />
                                        </div>
                                        <div className="text-gray-600 line-clamp-3 text-sm leading-relaxed mb-3 italic">
                                            {highlightText(result.content, query)}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-tighter">
                                            {result.chapter?.number && (
                                                <span>Chapter {highlightText(result.chapter.number, query)} — {highlightText(result.chapter.title, query)}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
