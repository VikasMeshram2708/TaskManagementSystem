"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { MdLogout } from "react-icons/md";
import { RiDeleteBack2Fill } from "react-icons/ri";

export default function Navbar() {
  const { data, status } = useSession();
  console.log("da", data?.user);
  const [tlogout, setTLogout] = useState(false);

  if (tlogout) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-gray-200 p-8 rounded-lg shadow-lg shadow-gray-400 flex flex-col items-center space-y-4">
          <p className="text-lg font-semibold">Confirm Logout</p>
          <div className="flex space-x-4">
            <button
              onClick={() => signOut()}
              type="button"
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-300"
              aria-label="Confirm Logout"
            >
              <MdLogout size={24} color="white" />
              <span className="text-sm font-bold text-white">Logout</span>
            </button>
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-300"
              aria-label="Cancel Logout"
            >
              <RiDeleteBack2Fill size={24} color="white" />
              <span className="text-sm font-bold text-white">Cancel</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="bg-blue-500 p-4 flex items-center justify-between shadow-md md:px-8">
      <h2 className="text-xl md:text-2xl font-bold text-white">
        <Link href="/">Task Management</Link>
      </h2>
      {status === "loading" ? (
        <p className="text-base md:text-lg font-medium text-white">
          Loading...
        </p>
      ) : status === "authenticated" ? (
        <>
          <div className="relative inline-block text-left">
            <select className="block px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300">
              <option value="" className="py-2">
                {data?.user?.name || data?.user?.firstname}
              </option>
              <option
                onClick={() => setTLogout((prev) => !prev)}
                value=""
                className="py-2"
              >
                Logout
              </option>
            </select>
          </div>
        </>
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
