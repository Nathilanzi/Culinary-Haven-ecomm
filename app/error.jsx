"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

/**
 * ErrorPage Component
 * A modern, animated error page with Framer Motion
 *
 * @param {Object} props - The component props
 * @param {number} [props.statusCode=500] - The HTTP status code of the error
 * @returns {JSX.Element} Animated error page
 */
export default function ErrorPage({ statusCode = 500 }) {
  // Refresh page function
  const refreshPage = () => {
    window.location.reload();
  };

  // Animation variants for different elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <motion.div
        className="text-center max-w-md w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Error Code */}
        <motion.h1
          className="text-9xl font-bold text-teal-600 mb-4 select-none"
          variants={itemVariants}
        >
          {statusCode}
        </motion.h1>

        {/* Error Message */}
        <motion.h2
          className="text-3xl font-semibold text-gray-800 mb-4"
          variants={itemVariants}
        >
          Oops! Something went wrong
        </motion.h2>

        <motion.p className="text-gray-600 mb-8" variants={itemVariants}>
          We're sorry, but an unexpected error occurred. Don't worry, our team
          has been notified.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="flex justify-center space-x-4"
          variants={itemVariants}
        >
          <motion.button
            onClick={refreshPage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-6 py-3 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-colors"
          >
            <RefreshCw className="mr-2" />
            Try Again
          </motion.button>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/recipes"
              className="flex items-center px-6 py-3 bg-white text-teal-600 border border-teal-200 rounded-full shadow-lg hover:bg-teal-50 transition-colors"
            >
              <Home className="mr-2" />
              Go Home
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
