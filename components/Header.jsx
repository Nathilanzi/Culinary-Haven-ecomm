"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Suspense } from "react";
import SearchBar from "./SearchBar";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Alert from "./Alert";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [navAlertConfig, setNavAlertConfig] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSearch = () => setIsSearchVisible(!isSearchVisible);

  const updateFavoritesCount = useCallback(async () => {
    if (session) {
      try {
        const response = await fetch("/api/favorites?action=count");
        const data = await response.json();
        setFavoritesCount(data.count);
      } catch (error) {
        console.error("Error fetching favorites count:", error);
      }
    } else {
      setFavoritesCount(0);
    }
  }, [session]);

  useEffect(() => {
    updateFavoritesCount();

    // Set up an event listener for favorites updates
    window.addEventListener("favoritesUpdated", updateFavoritesCount);

    return () => {
      window.removeEventListener("favoritesUpdated", updateFavoritesCount);
    };
  }, [updateFavoritesCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsSearchVisible(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      // Handle click outside mobile menu
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest("button[aria-label=\"toggle-mobile-menu\"]")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      setIsUserMenuOpen(false);
      const result = await signOut({ redirect: false, callbackUrl: "/" });
      if (result?.url) {
        setNavAlertConfig({
          isVisible: true,
          message: "Successfully signed out",
          type: "success",
        });
        setTimeout(() => router.push(result.url), 3000);
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      setNavAlertConfig({
        isVisible: true,
        message: "Error signing out",
        type: "error",
      });
    }
  };

  const handleLogin = () => {
    setIsUserMenuOpen(false);
    router.push("/auth/signin");
  };

  const handleSignup = () => {
    setIsUserMenuOpen(false);
    router.push("/auth/signup");
  };

  const UserMenu = () => {
    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

    return (
      <div className="relative" ref={userMenuRef}>
        <button
          onClick={toggleUserMenu}
          className="flex items-center space-x-2 p-2 rounded-full text-white hover:bg-[#0c3b2e93] transition-colors duration-300 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill={session ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
            {status === "authenticated" ? (
              <>
                <div className="flex justify-end px-4 py-2">
                  <ThemeToggle />
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/saved-recipes"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Saved Recipes
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="flex justify-end px-4 py-2">
                  <ThemeToggle />
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogin}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Sign In
                </button>
                <button
                  onClick={handleSignup}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Sign Up
                </button>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Settings
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      className="bg-[#0C3B2E] dark:bg-[#0A2A21] dark:text-[#DAF1DE] shadow-md fixed z-50 w-full"
      ref={navbarRef}
    >
      <Alert
        isVisible={navAlertConfig.isVisible}
        message={navAlertConfig.message}
        type={navAlertConfig.type}
        onClose={() =>
          setNavAlertConfig((prev) => ({ ...prev, isVisible: false }))
        }
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c3b2e] via-[#0f4d3d] to-[#0c3b2e] opacity-50" />

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className={`flex items-center ${isSearchVisible ? "hidden sm:flex" : "flex"}`}
          >
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gray-100 rounded-lg">
                <Image
                  src="/logo.png"
                  width={100}
                  height={100}
                  alt="Logo"
                  className="h-10 w-12"
                />
              </div>
              <span className="text-xl font-serif text-white">
                Culinary Haven
              </span>
            </Link>
          </div>

          <div className="flex flex-grow space-x-6 items-center justify-end">
            <div
              className={`flex-grow max-w-md ${isSearchVisible ? "w-full" : "w-auto"}`}
            >
              <Suspense>
                <SearchBar
                  isVisible={isSearchVisible}
                  onToggle={toggleSearch}
                />
              </Suspense>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-white hover:text-gray-200 transition-colors duration-200 text-sm font-medium"
              >
                Recipes
              </Link>
              <div className="flex justify-center">
                <Link
                  href="/favorites"
                  className={"relative flex items-center text-white"}
                >
                  Favorites
                  {favoritesCount > 0 && (
                    <span className="absolute -top-2 -right-5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
              </div>

              <Link
                href="/shopping-list"
                className="text-white hover:text-gray-200 transition-colors duration-200 text-sm font-medium"
              >
                Shopping List
              </Link>
              <UserMenu />
            </div>
          </div>

          <button
            onClick={toggleMenu}
            aria-label="toggle-mobile-menu"
            className="md:hidden p-2 rounded-lg text-white hover:bg-[#0c3b2e93] transition-colors duration-200 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden relative bg-[#0C3B2E] border-t border-[#ffffff1a]"
        >
          <div className="flex justify-end px-4 py-2">
            <ThemeToggle />
          </div>
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 text-white hover:bg-[#0c3b2e93] rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              Recipes
            </Link>
            <div className="flex ml-3">
              <Link
                href="/favorites"
                className={"relative flex items-center text-white"}
              >
                Favorites
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Link>
            </div>
            <Link
              href="/shopping-list"
              className="block px-3 py-2 text-white hover:bg-[#0c3b2e93] rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              Shopping List
            </Link>
            {status === "authenticated" ? (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-white hover:bg-[#0c3b2e93] rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-[#0c3b2e93] rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="block px-3 py-2 text-white hover:bg-[#0c3b2e93] rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-3 py-2 text-white hover:bg-[#0c3b2e93] rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
