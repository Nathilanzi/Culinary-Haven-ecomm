import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import OnlineStatus from "@/components/OnlineStatus"; // Import the OnlineStatus component
import { ThemeProvider } from "@/ThemeContext";
import SessionProvider from "@/components/SessionProvider";
import { getServerSession } from "next-auth/next";

/**
 * Metadata for the application, including SEO and social sharing configuration.
 * @constant
 * @type {Object}
 */
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
  manifest: "/site.webmanifest",
  themeColor: "#daf1de",
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Culinary Haven",
  },
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

/**
 * RootLayout Component
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render inside the layout.
 * @returns {JSX.Element} The rendered root layout for the application.
 *
 * @description This is the main layout component for the application, providing a consistent
 * structure with a header, footer, and session management. It also sets global metadata for SEO
 * and social sharing purposes.
 *
 * @example
 * // Example usage:
 * <RootLayout>
 *   <div>Your content here</div>
 * </RootLayout>
 */
export default async function RootLayout({ children }) {
  /**
   * Retrieves the server-side session for the current user.
   * @async
   * @function getServerSession
   * @returns {Promise<Object>} The session object.
   */
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-[#daf1de] dark:bg-[#1B1F1D]">
        <SessionProvider session={session}>
          <ThemeProvider>
            <Header />
            <OnlineStatus /> 
            {children}
            <main className="pt-16">{children}</main>
            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
