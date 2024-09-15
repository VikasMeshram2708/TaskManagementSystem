"use client";

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-900 text-black dark:text-black-100 p-4">
      <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-lg max-w-md w-full sm:max-w-lg p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-black-900 dark:text-black-100">Oops! Something went wrong.</h2>
        <p className="mb-4 text-black-700 dark:text-black-300">
          We encountered an unexpected issue. Please try again or contact support if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row justify-between sm:space-x-4">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition duration-150 mb-2 sm:mb-0"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition duration-150"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}
