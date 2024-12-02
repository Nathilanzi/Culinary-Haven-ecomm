"use client";

import Image from "next/image"; 
import Link from "next/link"; 
import { Telescope, LogIn } from "lucide-react";
import { useState, useEffect } from "react"; // Import useEffect and useState

/**
 * Home page component that serves as a landing page with a hero section
 * and navigation to recipes.
 *
 * @component
 * @returns {JSX.Element} The rendered home page component.
 */
export default function Home() {
  // Add state for PWA installation
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log(outcome === "accepted" ? "User accepted the install prompt" : "User dismissed the install prompt");

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismissClick = () => {
    console.log("User dismissed the install prompt");
    setShowInstallPrompt(false);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden group">
      {/* Background Image with Modern Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/hero_section1.jpg"
          alt="Culinary Artistry Backdrop"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0 bg-gradient-to-r 
           from-teal-900/70 dark:from-slate-900/80
           via-teal-700/50 dark:via-slate-800/60
           to-teal-500/30 dark:to-slate-700/40"
        />
      </div>
      
      {/* Content Container with Elegant Typography */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl space-y-6">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl 
               font-serif font-bold
               text-teal-50 dark:text-slate-100
               leading-tight
               drop-shadow-lg"
            >
              Culinary Exploration Awaits
            </h1>
            <p
              className="text-lg sm:text-xl md:text-2xl 
               text-teal-100 dark:text-slate-300
               mb-8 max-w-2xl
               leading-relaxed"
            >
              Embark on a gastronomic journey through our meticulously curated 
              recipe collections. From innovative weeknight meals to exquisite 
              gourmet experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/recipes"
                className="flex items-center gap-2 px-6 py-3
                 bg-teal-600 dark:bg-slate-700
                 hover:bg-teal-700 dark:hover:bg-slate-600
                 text-white
                 font-semibold
                 rounded-xl
                 transition-all
                 shadow-md hover:shadow-lg"
              >
                <Telescope className="w-5 h-5" />
                Explore Recipes
              </Link>
              <Link
                href="/auth/signin"
                className="flex items-center gap-2 px-6 py-3
                 bg-teal-500/10 dark:bg-slate-500/10
                 hover:bg-teal-500/20 dark:hover:bg-slate-500/20
                 text-teal-50 dark:text-slate-100
                 border border-teal-300/30 dark:border-slate-300/30
                 font-semibold
                 rounded-xl
                 backdrop-blur-sm
                 transition-all
                 shadow-md hover:shadow-lg"
              >
                <LogIn className="w-5 h-5" />
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle Bottom Gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-24 
         bg-gradient-to-t
         from-teal-900/80 dark:from-slate-900/90
         to-transparent"
      />

      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <div
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-lg p-4 border border-teal-500 
           transition-transform transform duration-300 ease-in-out"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-teal-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">Install App</p>
              <p className="mt-1 text-sm text-gray-500">
                Install our app for a better experience and offline access.
              </p>
              <div className="mt-4 flex">
                <button
                  onClick={handleInstallClick}
                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm 
                   leading-4 font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Install
                </button>
                <button
                  onClick={handleDismissClick}
                  className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm 
                   leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Maybe later
                </button>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={handleDismissClick}
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}