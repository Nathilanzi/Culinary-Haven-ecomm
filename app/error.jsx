"use client";

import { ErrorLayout, Button } from "@/components/ErrorShared";

/**
 * ErrorPage Component
 *
 * @param {Object} props - The component props.
 * @param {number} [props.statusCode=500] - The HTTP status code of the error (defaults to 500).
 * @returns {JSX.Element} The rendered error page.
 *
 * @description This component displays a user-friendly error page with options to refresh
 * the page or navigate back to the homepage. It uses the `ErrorLayout` component to format
 * the error message and the `Button` component for actions.
 *
 * @example
 * // Example usage:
 * <ErrorPage statusCode={404} />
 */
export default function ErrorPage({ statusCode = 500 }) {
  /**
   * Refreshes the current page.
   *
   * @function refreshPage
   * @description Reloads the current page to retry the last action.
   */
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <ErrorLayout
      code={statusCode.toString()}
      title="Something went wrong"
      message="We encountered an error while processing your request. Don't worry, it's not your fault."
      buttons={
        <>
          <Button onClick={refreshPage}>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </Button>
          <Button href="/">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go Home
          </Button>
        </>
      }
    />
  );
}
