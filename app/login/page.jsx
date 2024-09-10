"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginUserSchema } from "../models/User";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginUserSchema),
  });

  async function onSubmit(data) {
    console.log("Submitted data:", data);
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        return toast.error(result.message || "Login failed");
      }
      toast.success(result.message || "Login successful");
      console.log("Response data:", result);
      router.push("/");
    } catch (error) {
      console.log("Something went wrong. Login failed:", error);
      toast.error("Something went wrong. Login failed");
    }
  }

  async function handleGoogleSignIn() {
    try {
      await signIn("google"); // Ensure you have Google provider configured in NextAuth
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed");
    }
  }

  return (
    <section className="min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow shadow-gray-500 p-4 rounded w-full mt-20 max-w-lg mx-auto"
      >
        <h2 className="w-full max-w-lg mx-auto text-blue-700 text-4xl py-5 font-bold">
          Login
        </h2>
        <div className="grid gap-4">
          <div>
            <input
              {...register("email", { required: true })}
              className="px-4 py-2 rounded w-full text-black shadow shadow-gray-500"
              type="email"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-sm font-bold text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <input
              {...register("password", { required: true })}
              className="px-4 py-2 rounded w-full text-black shadow shadow-gray-500"
              type="password"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-sm font-bold text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-lg font-bold"
          >
            Login
          </button>
          <div className="flex flex-col items-center gap-3 justify-center">
            <p>
              Not a user ? <Link href="/signup">Sign Up</Link>
            </p>
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-lg font-bold"
            >
              Sign In with Google
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
