"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export const AnimatedDigit = ({ digit }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setInterval(() => {
      setIsAnimating((prev) => !prev);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span
      className={`inline-block transition-transform duration-700 ${
        isAnimating ? "animate-bounce" : ""
      }`}
    >
      {digit}
    </span>
  );
};

export const Button = ({ href, onClick, children }) => {
  const baseStyle =
    "inline-flex items-center px-6 py-3 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0C3B2E]";

  if (href) {
    return (
      <Link href={href} className={`${baseStyle} bg-[#0C3B2E]`}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseStyle} bg-[#0C3B2E]/90`}>
      {children}
    </button>
  );
};

export const ErrorLayout = ({ title, message, code, buttons }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-[#0C3B2E]/5 -top-32 -left-32 animate-pulse" />
        <div className="absolute w-96 h-96 rounded-full bg-[#0C3B2E]/5 -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      {/* Main content */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full transform transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        }`}
      >
        <div className="text-center">
          {/* Error code */}
          {code && (
            <h1 className="text-8xl font-bold text-[#0C3B2E] mb-8 tracking-tight">
              {code.split("").map((digit, idx) => (
                <AnimatedDigit key={idx} digit={digit} />
              ))}
            </h1>
          )}

          {/* Title */}
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">{title}</h2>

          {/* Message */}
          <p className="text-gray-600 mb-8">{message}</p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {buttons}
          </div>
        </div>
      </div>
    </div>
  );
};