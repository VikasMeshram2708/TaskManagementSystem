"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { RiDeleteBack2Fill } from "react-icons/ri";

export default function Navbar() {
  const { data, status } = useSession();
  const [tlogout, setTLogout] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
              onClick={() => setTLogout(false)}
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
        <p className="text-base md:text-lg font-medium text-white">Loading...</p>
      ) : status === "authenticated" ? (
        <>
          <div className="relative rounded">
            <div
              className="bg-gray-200 flex items-center gap-2 rounded px-4 py-2 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FaRegUserCircle size={24} color="black" />
              <span>{data?.user?.name || data?.user?.firstname}</span>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded-lg shadow-lg">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <button className="bg-red-500 p-2 rounded text-white font-black text-sm" onClick={() => setTLogout(true)}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
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
