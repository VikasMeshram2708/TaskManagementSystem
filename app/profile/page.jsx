"use client";

import { useQuery } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaPhone,
  FaEdit,
  FaSignOutAlt,
} from "react-icons/fa";

export default function ProfilePage() {
  const { data: udata, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/user/me");
      const result = await res.json();
      if (!res.ok) {
        console.log(`Something went wrong. Failed to fetch user`);
      }
      return result?.data;
    },
  });

  if (error) {
    return <div>Error fetching user data.</div>;
  }

  return (
    <section className="min-h-screen bg-blue-50 flex flex-col items-center py-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <div className="flex flex-col items-center">
          {/* Profile Picture */}
          <FaUser size={64} className="text-blue-500 mb-4" />
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">
            {udata?.firstname || "User"}
          </h2>
          <p className="text-sm text-gray-500 mb-6">Profile Information</p>

          {/* Email Field */}
          <div className="flex items-center text-lg text-gray-700 w-full mb-3">
            <FaEnvelope className="text-blue-500 mr-3" />
            <span>{udata?.email || "No email provided"}</span>
          </div>

          {/* Account Creation Date */}
          <div className="flex items-center text-lg text-gray-700 w-full mb-3">
            <FaCalendarAlt className="text-blue-500 mr-3" />
            <span>
              {udata?.createdAt
                ? new Date(udata.createdAt).toLocaleDateString()
                : "Account creation date unavailable"}
            </span>
          </div>

          
          {/* Logout Buttons at the Bottom */}
          <div className="flex justify-between w-full mt-4">

            {/* Logout Button */}
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
