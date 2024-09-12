"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { UserSchema } from "../models/User";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UserSchema),
  });

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setIsSubmitting(false);
        return toast.error(result.message);
      }

      toast.success(result.message);
      router.push("/login");
      reset();
    } catch (error) {
      console.error("Sign Up failed", error);
      toast.error("Sign Up Failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignUp() {
    try {
      await signIn("google", { callbackUrl: "/login" });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed");
    }
  }

  return (
    <section className="min-h-screen conatiner mx-auto px-4 py-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow shadow-gray-500 p-4 rounded w-full mt-20 max-w-lg mx-auto"
      >
        <h2 className="w-full max-w-lg mx-auto text-blue-700 text-4xl py-5 font-bold">
          Sign Up
        </h2>
        <div className="grid gap-4">
          <div>
            <label htmlFor="firstname" className="sr-only">
              First Name
            </label>
            <input
              {...register("firstname", { required: true })}
              id="firstname"
              className="px-4 py-2 rounded w-full text-black shadow shadow-gray-500"
              type="text"
              placeholder="First Name"
              aria-label="First Name"
            />
            {errors.firstname && (
              <p className="text-sm font-bold text-red-500">
                {errors.firstname.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="lastname" className="sr-only">
              Last Name
            </label>
            <input
              {...register("lastname", { required: true })}
              id="lastname"
              className="px-4 py-2 rounded w-full text-black shadow shadow-gray-500"
              type="text"
              placeholder="Last Name"
              aria-label="Last Name"
            />
            {errors.lastname && (
              <p className="text-sm font-bold text-red-500">
                {errors.lastname.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              {...register("email", { required: true })}
              id="email"
              className="px-4 py-2 rounded w-full text-black shadow shadow-gray-500"
              type="email"
              placeholder="Email"
              aria-label="Email"
            />
            {errors.email && (
              <p className="text-sm font-bold text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              {...register("password", { required: true })}
              id="password"
              className="px-4 py-2 rounded w-full text-black shadow shadow-gray-500"
              type="password"
              placeholder="Password"
              aria-label="Password"
            />
            {errors.password && (
              <p className="text-sm font-bold text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="cPassword" className="sr-only">
              Confirm Password
            </label>
            <input
              {...register("cPassword", { required: true })}
              id="cPassword"
              className="px-4 py-2 rounded w-full text-black shadow shadow-gray-500"
              type="password"
              placeholder="Confirm Password"
              aria-label="Confirm Password"
            />
            {errors.cPassword && (
              <p className="text-sm font-bold text-red-500">
                {errors.cPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-lg font-bold ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </button>
          <div className="flex flex-col items-center gap-3 justify-center">
            <p >
              Already a user? <Link href="/login" className="text-blue-500 font-bold">Login</Link>
            </p>
            <button
              onClick={handleGoogleSignUp}
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-lg font-bold"
            >
              Sign Up with Google
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
