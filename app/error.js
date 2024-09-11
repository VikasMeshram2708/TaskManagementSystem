'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-red-500 mb-4">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-700 mb-6">
          An error occurred. Please try refreshing the page or click the button below to attempt to fix the issue.
        </p>
        <button
          onClick={() => reset()}
          className="bg-blue-500 hover:bg-blue-600 transition-colors px-6 py-2 rounded text-white text-base font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
