"use client";

import { signOut, useSession } from "next-auth/react";
import { MdOutlineLogout } from "react-icons/md";
import Link from "next/link";

export default function Navbar() {
  const { data, status } = useSession();

  return (
    <nav className="bg-blue-500 p-4 flex items-center justify-between shadow-md md:px-8">
      <h2 className="text-xl md:text-2xl font-bold text-white">
        <Link href="/">Task Management</Link>
      </h2>
      {status === "loading" ? (
        <p className="text-base md:text-lg font-medium text-white">Loading...</p>
      ) : status === "authenticated" ? (
        <button
          onClick={() => signOut("google")}
          className="flex items-center px-3 py-2 md:px-4 md:py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-300 font-semibold shadow-md hover:shadow-lg"
        >
          <span>Logout</span>
          <MdOutlineLogout data-testid="logout-icon" className="w-5 h-5 ml-2" />
        </button>
      ) : (
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/login">
            <button className="bg-white text-black px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow duration-300">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="bg-transparent text-white border border-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
