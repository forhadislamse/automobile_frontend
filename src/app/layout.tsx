// import NextAuthSessionProvider from "@/lib/NextAuthSessionProvider";
// import ReduxProvider from "@/redux/ReduxProvider";
// import type { Metadata } from "next";
// import { Manrope } from "next/font/google";
// import Script from "next/script";
// import { Toaster } from "sonner";
// import "./globals.css";

// const manrope = Manrope({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "700"],
// });

// export const metadata: Metadata = {
//   title: "SMARTAUTOTECH",
//   description: "AI-powered automotive diagnostic assistant",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <head>
//         <Script
//           id="google-tag-manager"
//           strategy="afterInteractive"
//           dangerouslySetInnerHTML={{
//             __html: `
//             (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
//             new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//             j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//             'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
//             })(window,document,'script','dataLayer','GTM-W6K34885');
//           `,
//           }}
//         />
//         <Script
//           src="https://www.googletagmanager.com/gtag/js?id=G-9G1L4Y6BZH"
//           strategy="afterInteractive"
//         />
//         <Script
//           id="google-analytics"
//           strategy="afterInteractive"
//           dangerouslySetInnerHTML={{
//             __html: `
//             window.dataLayer = window.dataLayer || [];
//             function gtag(){window.dataLayer.push(arguments);}
//             gtag('js', new Date());
//             gtag('config', 'G-9G1L4Y6BZH');
//           `,
//           }}
//         />
//       </head>
//       <body className={`${manrope.className} antialiased`}>
//         <noscript>
//           <iframe
//             src="https://www.googletagmanager.com/ns.html?id=GTM-W6K34885"
//             height="0"
//             width="0"
//             style={{ display: "none", visibility: "hidden" }}
//           ></iframe>
//         </noscript>
//         <Toaster position="top-center" richColors />
//         <NextAuthSessionProvider>
//           <ReduxProvider>{children}</ReduxProvider>
//         </NextAuthSessionProvider>
//       </body>
//     </html>
//   );
// }

import NextAuthSessionProvider from "@/lib/NextAuthSessionProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "SMARTAUTOTECH",
  description: "AI-powered automotive diagnostic assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased`}>
        {/* ✅ GTM noscript - body এর একদম শুরুতে */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W6K34885"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <Toaster position="top-center" richColors />
        <NextAuthSessionProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </NextAuthSessionProvider>

        {/* ✅ GTM Script - body এর শেষে */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-W6K34885');
            `,
          }}
        />

        {/* ✅ GA4 Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9G1L4Y6BZH"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9G1L4Y6BZH');
            `,
          }}
        />
      </body>
    </html>
  );
}
