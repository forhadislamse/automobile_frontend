"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetAllPlansQuery } from "@/redux/api/planApi";
import { Search, BookOpen, ShieldCheck, CreditCard, ChevronRight, BadgeCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import BookCover from "@/src/assets/book-cover.png";
import HeroBg from "@/src/assets/dark_legal_library_bg.png";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/redux/api/authApi";

export default function LandingPage() {
    const { data: plans, isLoading } = useGetAllPlansQuery(undefined);
    const token = useAppSelector((state) => state.auth.token);
    const { data: userData } = useGetMeQuery(undefined, { skip: !token });
    const user = (userData as any)?.data;
    const router = useRouter();
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative min-h-[600px] lg:min-h-[750px] flex items-center pt-24 pb-0 bg-[#0F172A] z-20">
                {/* Background Image Wrapper */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/95 to-[#0F172A]/40 z-10"></div>
                    <Image
                        src={HeroBg.src}
                        alt="Legal Library Background"
                        fill
                        className="object-cover opacity-50"
                        priority
                    />
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
                        <div className="lg:w-1/2 text-left flex flex-col justify-center">
                            <h1 className="text-4xl lg:text-6xl font-bold text-white  leading-tight mb-8 uppercase tracking-tight">
                                Texas Ethics Laws — <br className="hidden lg:block" />
                                <span className="text-white">The Complete Legal <br className="hidden lg:block" /> Practice Guide</span>
                            </h1>
                            <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-xl font-light italic">
                                Master over 550 pages of annotated ethics rules, statutes, and case law in one comprehensive, searchable digital volume. Built for the modern Texas practitioner.
                            </p>
                            <div className="flex flex-wrap gap-5">
                                <Link href="#pricing">
                                    <Button size="lg" className="bg-[#0D7C84] hover:bg-[#0B656B] text-white px-10 py-7 rounded-full text-xl font-bold transition-all shadow-xl hover:shadow-[#0D7C84]/40 uppercase tracking-widest">
                                        Start Subscription
                                    </Button>
                                </Link>
                                <Link href="/user/reader">
                                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#0F172A] bg-transparent px-10 py-7 rounded-full text-xl font-bold transition-all uppercase tracking-widest">
                                        Preview the Guide
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="hidden lg:flex lg:w-1/2 justify-center lg:justify-end">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative"
                            >
                                {/* Glow effect */}
                                <div className="absolute -inset-4 bg-[#0D7C84]/20 rounded-full blur-3xl"></div>

                                <div className="relative bg-white/5 p-2 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl">
                                    <Image
                                        src={BookCover}
                                        alt="Texas Ethics Laws Book Cover"
                                        width={700}
                                        height={960}
                                        className="rounded-xl shadow-2xl object-cover hover:scale-[1.01] transition-transform duration-500"
                                        priority
                                    />

                                    {/* Floating Badge - Fixed to Corner */}
                                    <div className="absolute bottom-4 -right-8 bg-white p-2 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 shadow-blue-500/10 z-30">
                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                            <BadgeCheck />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Authentic</p>
                                            <p className="text-sm font-bold text-gray-900 leading-none">9th Edition</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                {/* Decorative Background SVGs - Left */}
                <div className="absolute top-1/2 -left-20 -translate-y-1/2 opacity-[0.05] pointer-events-none hidden lg:block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="-170 0 460 400" fill="none">
                        <path d="M284.862 111.236L64.4177 0.587036C63.6828 0.201446 62.8654 0 62.0355 0C61.2056 0 60.3881 0.201446 59.6533 0.587036L-160.791 111.236C-162.996 112.374 -164.133 114.791 -163.565 117.209C-162.996 119.627 -160.933 121.334 -158.445 121.334H-131.707V147.929C-131.707 150.845 -129.289 153.263 -126.373 153.263H-112.151V193.085C-112.151 196 -109.733 198.418 -106.818 198.418H-101.911V333.103H-107.956C-110.871 333.103 -113.289 335.52 -113.289 338.436V356.214H-149.413C-152.329 356.214 -154.747 358.632 -154.747 361.547V384.516C-154.747 387.432 -152.329 389.849 -149.413 389.849H273.413C276.329 389.849 278.747 387.432 278.747 384.516V361.547C278.747 358.632 276.329 356.214 273.413 356.214H237.218V338.436C237.218 335.52 234.8 333.103 231.884 333.103H225.84V198.489H230.747C233.662 198.489 236.08 196.071 236.08 193.156V153.334H250.302C253.218 153.334 255.635 150.916 255.635 148V121.405H282.444C284.933 121.405 287.067 119.698 287.636 117.28C288.204 114.863 287.067 112.374 284.862 111.236ZM-39.2623 153.334V193.156C-39.2623 196.071 -36.8445 198.489 -33.929 198.489H-29.0223V333.174H-35.0667C-37.9823 333.174 -40.4001 335.591 -40.4001 338.507V356.285H-54.1956V338.507C-54.1956 335.591 -56.6134 333.174 -59.529 333.174H-65.5734V198.489H-60.6667C-57.7512 198.489 -55.3334 196.071 -55.3334 193.156V153.334H-39.2623ZM33.6266 153.334V193.156C33.6266 196.071 36.0444 198.489 38.9599 198.489H43.8666V333.174H37.8221C34.9066 333.174 32.4888 335.591 32.4888 338.507V356.285H18.6933V338.507C18.6933 335.591 16.2755 333.174 13.3599 333.174H7.24437V198.489H12.151C15.0666 198.489 17.4844 196.071 17.4844 193.156V153.334H33.6266ZM106.515 153.334V193.156C106.515 196.071 108.933 198.489 111.849 198.489H116.755V333.174H110.711C107.795 333.174 105.378 335.591 105.378 338.507V356.285H91.5822V338.507C91.5822 335.591 89.1644 333.174 86.2488 333.174H80.2044V198.489H85.111C88.0266 198.489 90.4444 196.071 90.4444 193.156V153.334H106.515ZM179.333 153.334V193.156C179.333 196.071 181.751 198.489 184.667 198.489H189.573V333.174H183.529C180.613 333.174 178.195 335.591 178.195 338.507V356.285H164.4V338.507C164.4 335.591 161.982 333.174 159.067 333.174H153.022V198.489H157.929C160.844 198.489 163.262 196.071 163.262 193.156V153.334H179.333ZM127.422 198.489H142.355V333.174H127.422V198.489ZM122.089 343.84H153.733V356.285H115.973V343.84H122.089ZM152.595 187.823H117.182V153.334H152.595V187.823ZM54.5333 198.489H69.4666V333.174H54.5333V198.489ZM49.1999 343.84H80.8444V356.285H43.0844V343.84H49.1999ZM79.7066 187.823H44.2933V153.334H79.7066V187.823ZM-18.2845 198.489H-3.35118V333.174H-18.2845V198.489ZM-23.6178 343.84H8.0266V356.285H-29.7334V343.84H-23.6178ZM6.8177 187.823H-28.5956V153.334H6.8177V187.823ZM-66.0001 187.823H-101.413V153.334H-66.0001V187.823ZM-91.1734 198.489H-76.2401V333.174H-91.1734V198.489ZM-102.551 343.84H-64.8623V356.285H-102.622V343.84H-102.551ZM268.08 379.254H-144.08V366.952H268.293V379.254H268.08ZM226.551 356.285H188.791V343.84H226.48V356.285H226.551ZM215.173 333.174H200.24V198.489H215.173V333.174ZM225.413 187.823H190V153.334H225.413V187.823ZM244.969 142.667H-121.111V121.405H244.898V142.667H244.969ZM250.302 110.667H-135.902L61.9999 11.3248L259.902 110.667H250.302Z" fill="#006D82" />
                    </svg>
                </div>

                {/* Decorative Background SVGs - Right */}
                <div className="absolute top-10 -right-10 opacity-[0.05] pointer-events-none hidden lg:block">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="350" height="450" viewBox="0 0 350 350" fill="none">
                            <path d="M337.733 282.27C335.451 278.734 332.729 275.607 329.64 272.976L298.247 245.595C297.998 245.22 297.712 244.871 297.394 244.553C296.863 244.025 296.248 243.589 295.573 243.264L276.588 226.706L188.714 150.051C192.311 146.291 194.291 141.373 194.291 136.144C194.291 130.757 192.195 125.694 188.383 121.883C186.765 120.267 184.88 118.94 182.812 117.962L190.942 109.832C193.207 110.436 195.542 110.743 197.886 110.745C204.767 110.744 211.648 108.126 216.886 102.888C221.964 97.8102 224.76 91.0612 224.76 83.8836C224.76 76.706 221.964 69.957 216.887 64.8796L159.879 7.8737C154.802 2.79634 148.052 0 140.873 0C133.696 0 126.949 2.79634 121.872 7.8737C114.855 14.8908 112.545 24.854 114.928 33.8182L33.8155 114.93C31.5462 114.325 29.2079 114.019 26.8595 114.019C19.6785 114.019 12.9323 116.814 7.85892 121.886C-2.61964 132.365 -2.61964 149.415 7.85892 159.894L64.8655 216.901C70.1055 222.141 76.9875 224.76 83.8695 224.76C90.7522 224.76 97.6342 222.141 102.874 216.901C109.891 209.884 112.201 199.921 109.819 190.957L117.932 182.843C118.921 184.906 120.253 186.785 121.873 188.4C125.68 192.207 130.741 194.304 136.127 194.304C141.35 194.304 146.266 192.327 150.032 188.734L243.628 296.27C243.886 296.673 244.187 297.057 244.539 297.409C244.659 297.529 244.787 297.639 244.914 297.747L272.804 329.792C273.506 330.619 274.241 331.417 275.008 332.184C282.668 339.842 292.786 343.997 303.408 343.997C305.281 343.997 307.171 343.868 309.063 343.606C321.714 341.855 332.647 334.287 339.058 322.84C346.081 310.294 345.559 294.366 337.733 282.27ZM131.374 17.3754C132.619 16.1236 134.099 15.131 135.73 14.4551C137.36 13.7791 139.108 13.4333 140.873 13.4375C142.639 13.4327 144.389 13.7783 146.02 14.4543C147.652 15.1302 149.133 16.1231 150.378 17.3754L207.386 74.3819C208.638 75.6268 209.63 77.1077 210.306 78.7387C210.982 80.3698 211.327 82.1187 211.323 83.8843C211.327 85.6499 210.982 87.3988 210.306 89.0299C209.63 90.661 208.637 92.1418 207.385 93.3866C202.148 98.6252 193.624 98.6252 188.387 93.3866L131.378 36.3773L131.374 36.374C126.136 31.136 126.136 22.6133 131.374 17.3754ZM93.3725 207.4C88.1332 212.639 79.6064 212.64 74.3672 207.4L17.3606 150.393C12.1206 145.153 12.1206 136.628 17.3606 131.388C19.8949 128.853 23.269 127.457 26.8595 127.457C30.4494 127.457 33.8215 128.852 36.3552 131.385L93.3718 188.402C98.6111 193.639 98.6111 202.162 93.3725 207.4ZM121.66 160.113L102.873 178.9L45.8608 121.888L121.872 45.875L178.884 102.888L160.063 121.709C160.002 121.767 159.943 121.823 159.878 121.887L121.892 159.874C121.813 159.951 121.737 160.032 121.66 160.113ZM145.65 174.129L145.61 174.169L140.879 178.9C140.256 179.526 139.515 180.022 138.699 180.36C137.884 180.697 137.009 180.87 136.126 180.867C135.243 180.87 134.368 180.697 133.553 180.36C132.737 180.022 131.996 179.526 131.374 178.899C130.747 178.276 130.25 177.535 129.912 176.719C129.574 175.902 129.401 175.027 129.404 174.143C129.404 172.384 130.075 170.729 131.293 169.481L169.456 131.318C172.072 128.774 176.301 128.806 178.885 131.388C179.512 132.011 180.008 132.752 180.346 133.569C180.684 134.385 180.857 135.26 180.855 136.144C180.858 137.027 180.685 137.901 180.347 138.717C180.009 139.532 179.512 140.272 178.885 140.894L174.181 145.597C174.149 145.629 174.117 145.661 174.085 145.693L145.65 174.129ZM159.563 179.219L179.199 159.582L262.338 232.101L232 262.44L159.563 179.219ZM240.843 272.6L272.488 240.955L282.638 249.808L249.686 282.761L240.843 272.6ZM327.335 316.276C322.999 324.018 315.668 329.127 307.222 330.296C298.795 331.463 290.515 328.687 284.507 322.682C283.995 322.17 283.503 321.636 283.035 321.082L282.97 321.006L258.527 292.921L292.787 258.66L320.838 283.128L320.902 283.184C323.002 284.969 324.865 287.113 326.446 289.563C331.527 297.414 331.883 308.15 327.335 316.276Z" fill="#006D82" />
                        </svg>
                    </motion.div>
                </div>

                <div className="absolute bottom-5 -right-5 opacity-[0.05] pointer-events-none hidden lg:block">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="220" height="280" viewBox="0 0 189 229" fill="none">
                            <path d="M79.1308 1.96523C76.5104 -0.655078 72.2507 -0.655078 69.6311 1.96523C67.0041 4.59227 67.0041 8.84523 69.6311 11.4655C72.2514 14.0926 76.5111 14.0926 79.1308 11.4655C81.7571 8.84523 81.7571 4.59227 79.1308 1.96523ZM170.118 185.638C173.08 181.625 174.681 176.791 174.681 171.708C174.681 158.743 164.133 148.193 151.167 148.193H36.9518C30.6677 148.193 24.7626 150.639 20.3235 155.079C15.8825 159.519 13.4368 165.424 13.4368 171.708C13.4323 176.72 15.0374 181.6 18.0157 185.63C7.31739 191.255 0 202.475 0 215.378V222.097C0 225.808 3.00866 228.816 6.71875 228.816H181.4C185.11 228.816 188.118 225.808 188.118 222.097V215.378C188.118 202.481 180.808 191.265 170.118 185.638ZM29.8245 164.58C30.7584 163.641 31.8692 162.897 33.0926 162.391C34.316 161.884 35.6277 161.626 36.9518 161.63H151.167C156.724 161.63 161.244 166.151 161.244 171.707C161.244 174.401 160.196 176.932 158.293 178.835C157.359 179.774 156.248 180.518 155.025 181.024C153.802 181.531 152.49 181.789 151.166 181.785H36.9518C31.3947 181.785 26.8743 177.264 26.8743 171.708C26.8743 169.014 27.9218 166.483 29.8245 164.58ZM13.4368 215.378C13.4368 204.265 22.4789 195.223 33.5924 195.223H154.526C165.639 195.223 174.681 204.265 174.681 215.378H13.4368Z" fill="#006D82" />
                        </svg>
                    </motion.div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4 uppercase">A Smarter Way to Explore Legal Ethics</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto italic text-lg whitespace-pre-line">Find the information you need faster with powerful search, structured chapters, and integrated legal references.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <Search />, title: "Search the Entire Guide", desc: "Find the information you need faster with powerful search, structured chapters, and integrated legal references." },
                            { icon: <BookOpen />, title: "Chapters and Sections", desc: "Navigate through clearly structured chapters covering key areas of Texas ethics law." },
                            { icon: <ShieldCheck />, title: "Legal Sources", desc: "Each section includes references to relevant statutes, ethics opinions, and legal resources." },
                            { icon: <CreditCard />, title: "Accessible Anywhere", desc: "Secure access to the guide from desktop, tablet, or mobile devices." }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 uppercase">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-[#F8FAFC]">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4  uppercase">Simple Access Plans for the Digital Guide</h2>
                    <p className="text-gray-600 mb-16 max-w-2xl mx-auto text-lg italic">
                        Choose the plan that fits your needs and get instant access to the Texas Ethics Laws digital practice guide.
                    </p>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {plans?.data?.map((plan: any) => (
                                <div
                                    key={plan.id}
                                    className={`p-10 rounded-3xl border flex flex-col h-full relative transition-all duration-300 ${plan.isPopular
                                        ? "bg-[#1E293B] text-white border-blue-500 shadow-2xl ring-4 ring-blue-500/20 scale-105 z-10"
                                        : "bg-white text-gray-900 border-gray-100 shadow-sm hover:shadow-md"
                                        }`}
                                >
                                    {plan.isPopular && (
                                        <div className="absolute top-4 right-4 rotate-12 bg-blue-600 text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-tighter text-white">
                                            Popular
                                        </div>
                                    )}

                                    <div className="mb-8">
                                        <h3 className={`text-xl font-bold uppercase mb-2 ${plan.isPopular ? "text-blue-400" : "text-gray-900"}`}>
                                            {plan.name}
                                        </h3>
                                        <div className="text-4xl font-bold ">
                                            ${plan.price}
                                            <span className={`text-lg font-normal ${plan.isPopular ? "text-gray-400" : "text-gray-400"}`}>
                                                {plan.duration === 'unlimited' ? '' : `/${plan.duration === 'yearly' ? 'yr' : 'mo'}`}
                                            </span>
                                        </div>
                                    </div>

                                    <ul className="text-left space-y-4 mb-10 flex-grow">
                                        {plan.features?.map((feature: string, idx: number) => (
                                            <li key={idx} className={`flex items-center gap-3 italic ${plan.isPopular ? "text-white" : "text-gray-600"}`}>
                                                <BadgeCheck size={18} className={plan.isPopular ? "text-blue-400" : "text-green-500"} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {plan.price === 0 ? (
                                        <Button
                                            onClick={() => {
                                                if (token) {
                                                    toast.success("You are already on the Free Plan");
                                                } else {
                                                    router.push("/login");
                                                }
                                            }}
                                            className={`w-full py-6 rounded-xl font-bold uppercase tracking-widest transition-all ${plan.isPopular
                                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/40"
                                                : "border-2 hover:border-blue-600 hover:text-blue-600"
                                                }`}
                                            variant={plan.isPopular ? "default" : "outline"}
                                        >
                                            Get Started
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => {
                                                if (!token) {
                                                    router.push("/login");
                                                } else if (user?.isSubscribed && user?.planId === plan.id && (user?.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date())) {
                                                    toast.success(`You are already subscribed to the ${plan.name}`);
                                                } else {
                                                    router.push(`/checkout/${plan.id}`);
                                                }
                                            }}
                                            className={`w-full py-6 rounded-xl font-bold uppercase tracking-widest transition-all ${plan.isPopular
                                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/40"
                                                : "border-2 hover:border-blue-600 hover:text-blue-600"
                                                }`}
                                            variant={plan.isPopular ? "default" : "outline"}
                                        >
                                            Subscribe Now
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8  uppercase">Unlock the complete digital guide today.</h2>
                    <Link href="#pricing">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-10 py-8 rounded-2xl text-xl font-bold uppercase tracking-widest transition-all shadow-2xl">START YOUR SUBSCRIPTION</Button>
                    </Link>
                    <p className="text-blue-100 mt-8 font-light italic text-lg">Trusted by Texas Legal Professionals.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-white border-t border-gray-100">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className=" font-bold text-2xl tracking-tighter text-[#1E293B]">
                        CATES <span className="text-blue-600">LEGAL</span>
                    </div>
                    <div className="text-gray-400 text-sm italic">
                        © 2026 Cates Legal Group. All rights reserved. Texas Ethics Laws 9th Edition.
                    </div>
                    <div className="flex gap-6">
                        <Link href="/terms" className="text-gray-400 hover:text-blue-600 text-sm underline decoration-gray-200">Terms</Link>
                        <Link href="/privacy" className="text-gray-400 hover:text-blue-600 text-sm underline decoration-gray-200">Privacy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
