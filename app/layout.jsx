import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ThemeProvider } from "@/ThemeContext";
import SessionProvider from "@/components/SessionProvider";
import { getServerSession } from "next-auth/next";

export const metadata = {
  title: {
    default: "Culinary Haven - Discover Delicious Recipes",
    template: "%s | Culinary Haven",
  },
  description:
    "Discover and explore a world of delicious recipes, cooking tips, and culinary inspiration. Find your next favorite dish with our extensive collection.",
  keywords: [
    "recipes",
    "cooking",
    "food",
    "culinary",
    "dishes",
    "meal plans",
    "cooking instructions",
  ],
  authors: [{ name: "Culinary Haven Team" }],
  openGraph: {
    title: "Culinary Haven - Discover Delicious Recipes",
    description:
      "Explore our collection of delicious recipes and cooking inspiration",
    url: "https://your-domain.com",
    siteName: "Culinary Haven",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Culinary Haven - Discover Delicious Recipes",
    description:
      "Explore our collection of delicious recipes and cooking inspiration",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://your-domain.com" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="bg-[#daf1de] dark:bg-[#1B1F1D]">
        <SessionProvider session={session}>
          <ThemeProvider>
            <Header />
            <main className="pt-16">{children}</main>
            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
