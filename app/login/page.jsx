"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginUserSchema } from "../models/User";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginUserSchema),
  });

  async function onSubmit(data) {
    console.log("Submitted data:", data);
    await signIn("credentials", {
      ...data,
      callbackUrl: "/",
    });
  }

  async function handleGoogleSignIn() {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed");
    }
  }

  return (
    <section className="min-h-screen container mx-auto px-4 py-2 flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow shadow-gray-500 p-6 rounded w-full max-w-md mx-auto bg-white"
      >
        <h2 className="text-center text-blue-700 text-3xl md:text-4xl font-bold mb-6">
          Login
        </h2>
        <div className="grid gap-5">
          <div>
            <input
              {...register("email", { required: true })}
              className="px-4 py-3 rounded w-full text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-shadow"
              type="email"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-sm font-semibold text-red-500 mt-2">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <input
              {...register("password", { required: true })}
              className="px-4 py-3 rounded w-full text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-shadow"
              type="password"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-sm font-semibold text-red-500 mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-3 font-bold transition-colors duration-300"
          >
            Login
          </button>

          <div className="flex flex-col items-center gap-3 mt-4">
            <p className="text-gray-600">
              Not a user?{" "}
              <Link href="/signup" className="text-blue-500">
                Sign Up
              </Link>
            </p>
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-3 font-bold transition-colors duration-300"
            >
              Sign In with Google
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
