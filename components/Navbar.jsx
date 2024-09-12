"use client";

import { signOut, useSession } from "next-auth/react";
import { MdOutlineLogout } from "react-icons/md";
import Link from "next/link";

export default function Navbar() {
  const { data, status } = useSession();
  // console.log('user-data', data)
  return (
    <nav className="bg-blue-500 p-4 flex items-center justify-between shadow-md">
      <h2 className="text-2xl font-bold text-white">
        <Link href="/">Task Management</Link>
      </h2>
      {status === "loading" ? (
        <p className="text-lg font-medium text-white">Loading...</p>
      ) : status === "authenticated" ? (
        <button
          onClick={() => signOut("google")}
          className="flex items-center px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-300 font-semibold shadow-md hover:shadow-lg"
        >
          <span>Logout</span>
          <MdOutlineLogout className="w-5 h-5 ml-2 font-bold" />
      
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow duration-300">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="bg-transparent text-white border border-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
