import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Manrope, Geist_Mono } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const title = `${site.companyShort} — ${site.productName} | Molecular Health Intelligence`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s · ${site.companyShort}`,
  },
  description: site.description,
  keywords: [
    "MHI",
    "MedSense Watch",
    "Molecular Health Intelligence",
    "wearable biosensor",
    "sweat biomarkers",
    "molecularly imprinted polymers",
    "microfluidics",
    "electrochemical biosensing",
    "personalized medicine",
    "MedTech",
  ],
  openGraph: {
    type: "website",
    title,
    description: site.description,
    siteName: site.companyName,
    images: [
      {
        url: "/images/hero-device.jpg",
        width: 1376,
        height: 768,
        alt: `${site.productName} by ${site.companyShort}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: ["/images/hero-device.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050b18",
  colorScheme: "dark light",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${geistMono.variable}`}>
      <body>
        {children}

        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        {PLAUSIBLE_DOMAIN && (
          <Script
            src="https://plausible.io/js/script.js"
            data-domain={PLAUSIBLE_DOMAIN}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
