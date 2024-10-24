"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Suspense } from "react";
import SearchBar from "./SearchBar";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const userMenuRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSearch = () => setIsSearchVisible(!isSearchVisible);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsSearchVisible(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const UserMenu = () => (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={toggleUserMenu}
        className="flex items-center space-x-2 p-2 rounded-lg text-white hover:bg-[#0c3b2e93] transition-colors duration-200 focus:outline-none"
      >
        {/* User Icon */}
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
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        {/* Chevron Down */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <Link
            href="/profile"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            My Profile
          </Link>
          <Link
            href="/saved-recipes"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Saved Recipes
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Settings
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-[#0C3B2E] shadow-md sticky z-50 top-0" ref={navbarRef}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-white rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
        <div className="absolute right-0 top-0 w-64 h-64 bg-white rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className={`flex items-center ${isSearchVisible ? "hidden sm:flex" : "flex"}`}
          >
            <Link href="/" className="flex items-center space-x-3">
              {/* Chef Hat Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span className="text-2xl font-serif font-semibold text-white">
                Culinary Haven
              </span>
            </Link>
          </div>

          <div className="flex flex-grow space-x-4 items-center justify-end">
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

            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="flex items-center space-x-2 text-white hover:bg-[#0c3b2e93] px-3 py-2 rounded-lg transition-colors duration-200"
              >
                {/* Recipe Book Icon */}
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
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span>Recipes</span>
              </Link>
              <Link
                href="/favorites"
                className="flex items-center space-x-2 text-white hover:bg-[#0c3b2e93] px-3 py-2 rounded-lg transition-colors duration-200"
              >
                {/* Heart Icon */}
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
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>Favorites</span>
              </Link>
              <Link
                href="/shopping-list"
                className="flex items-center space-x-2 text-white hover:bg-[#0c3b2e93] px-3 py-2 rounded-lg transition-colors duration-200"
              >
                {/* Shopping Bag Icon */}
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
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span>Shopping List</span>
              </Link>
              <UserMenu />
            </div>
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-white hover:bg-[#0c3b2e93] transition-colors duration-200 focus:outline-none"
          >
            {/* Menu Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden relative bg-[#0C3B2E] border-t border-[#ffffff1a]">
          <div className="px-4 py-3 space-y-3">
            <Link
              href="/"
              className="flex items-center space-x-2 text-white hover:bg-[#0c3b2e93] px-3 py-2 rounded-lg"
            >
              {/* Recipe Book Icon */}
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
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span>Recipes</span>
            </Link>
            <Link
              href="/favorites"
              className="flex items-center space-x-2 text-white hover:bg-[#0c3b2e93] px-3 py-2 rounded-lg"
            >
              {/* Heart Icon */}
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
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>Favorites</span>
            </Link>
            <Link
              href="/shopping-list"
              className="flex items-center space-x-2 text-white hover:bg-[#0c3b2e93] px-3 py-2 rounded-lg"
            >
              {/* Shopping Bag Icon */}
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
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span>Shopping List</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
