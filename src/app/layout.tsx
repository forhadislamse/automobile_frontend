import NextAuthSessionProvider from "@/lib/NextAuthSessionProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";
import { Roboto, Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "NextGen AutoTech | Shop Management Software",
  description: "NextGen AutoTech is the ultimate shop management software for automotive repair shops.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body className={`${roboto.variable} ${montserrat.variable} antialiased`}>
          <Toaster position="top-center" richColors />
          <NextAuthSessionProvider>
            <ReduxProvider>{children}</ReduxProvider>
          </NextAuthSessionProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
