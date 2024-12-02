"use client"; // Client component to handle client-side interactions

/**
 * A reusable button component that navigates the user back to the previous page
 * using the browser's history.
 *
 * @component
 * @returns {JSX.Element} A styled "Back" button with an `onClick` handler to navigate back.
 *
 * @example
 * // Example usage
 * <BackButton />
 *
 * @remarks
 * - The component is designed as a client component for handling browser-side interactions.
 * - Styling includes responsiveness, hover effects, and support for dark mode.
 */
export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()} // Navigates to the previous page in the browser's history
      className="w-[40%] px-4 ml-[119px] block text-center bg-teal-500 text-white font-semibold py-2 rounded-full shadow hover:bg-teal-600 transition-colors mt-[62px] dark:bg-teal-600 dark:hover:bg-teal-700"
    >
      Back
    </button>
  );
}
