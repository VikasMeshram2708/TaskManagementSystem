"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { status } = useSession();

  return (
    <header className="px-4 py-3 shadow-md">
      <nav className="container mx-auto flex items-center justify-between max-w-screen-xl">
        {/* Logo/Title */}
        <Link href="/" className="text-2xl md:text-3xl font-bold">
          Task Management
        </Link>

        {/* Right Section: Links/Buttons */}
        {status === "loading" ? (
          <p className="text-sm text-gray-600 md:text-base">Loading...</p>
        ) : status === "unauthenticated" ? (
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <button
                type="button"
                className="px-4 py-2 rounded text-sm md:text-base border border-transparent bg-gray-200 hover:bg-gray-300 text-gray-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Login"
              >
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button
                type="button"
                className="px-4 py-2 rounded text-sm md:text-base border border-gray-300 hover:text-black hover:bg-gray-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Sign Up"
              >
                Sign Up
              </button>
            </Link>
          </div>
        ) : (
          <button
            onClick={() => signOut()}
            type="button"
            className="px-4 py-2 rounded text-sm md:text-base bg-red-600 hover:bg-red-500 text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Logout"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
