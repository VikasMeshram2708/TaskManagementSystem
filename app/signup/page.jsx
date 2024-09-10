"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { UserSchema } from "../models/User";
// import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UserSchema),
  });

  async function onSubmit(data) {
    console.log("sgdata", data);
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
        return toast.error(result.message);
      }
      toast.success(result.message);
      console.log("sres", result);
      router.push("/login");
      return result;
    } catch (error) {
      console.log(`Something went wrong. Sign Up failed ${error}`);
      return toast.error("Sign Up Failed");
    }
  }
  return (
    <section className="min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow shadow-gray-500 p-4 rounded w-full mt-20 max-w-lg mx-auto"
      >
        <h2 className="w-full max-w-lg mx-auto text-blue-700 text-4xl py-5 font-bold">
          Sign Up
        </h2>
        <div className="grid gap-4">
          <div>
            <input
              {...register("firstname", { required: true })}
              className="px-4 py-2 rounded w-full text-black shadow shadow-gray-500"
              type="text"
              placeholder="First Name"
            />
            {errors.firstname && (
              <p className="text-sm font-bold text-red-500">
                {errors.firstname.message}
              </p>
            )}
          </div>
          <div>
            <input
              {...register("lastname", { required: true })}
              className="px-4 py-2 rounded w-full text-black shadow shadow-gray-500"
              type="text"
              placeholder="Last Name"
            />
            {errors.lastname && (
              <p className="text-sm font-bold text-red-500">
                {errors.lastname.message}
              </p>
            )}
          </div>
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
          <div>
            <input
              {...register("cPassword", { required: true })}
              className="px-4 py-2 rounded w-full text-black shadow shadow-gray-500"
              type="password"
              placeholder="Confirm Password"
            />
            {errors.cPassword && (
              <p className="text-sm font-bold text-red-500">
                {errors.cPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-lg font-bold"
          >
            Sign Up
          </button>
          <div className="flex flex-col items-center gap-3 justify-center">
            <p>
              Already a user ? <Link href="/login">Login</Link>
            </p>
            <button
              type="submit"
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
