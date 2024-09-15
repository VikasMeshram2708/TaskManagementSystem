"use client"; // This should be at the very top

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { UserSchemaLogin } from "../models/UserSchema";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchemaLogin>({
    resolver: zodResolver(UserSchemaLogin),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UserSchemaLogin) => {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
      });
      if (result?.ok) {
        toast.success("Logged In");
      } else if (result?.error) {
        toast.error(result.error || "Login Failed");
      }
    },
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit: SubmitHandler<UserSchemaLogin> = (data) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-full max-w-lg mx-auto px-4 py-2 rounded space-y-3 mt-24"
      >
        <h2 className="text-3xl font-bold py-3 text-black text-center">
          {isPending ? "Processing..." : "Login"}
        </h2>

        <div>
          <input
            {...register("email", { required: true })}
            className="text-sm rounded text-black px-4 py-2 w-full border shadow shadow-gray-400"
            type="email"
            placeholder="Email"
          />
          {errors?.email && (
            <p className="text-sm text-red-500">{errors?.email?.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("password", { required: true })}
            className="text-sm rounded text-black px-4 py-2 w-full border shadow shadow-gray-400"
            type="password"
            placeholder="Password"
          />
          {errors?.password && (
            <p className="text-sm text-red-500">{errors?.password?.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <button
            type="submit"
            className="px-4 py-2 rounded text-sm w-full font-bold bg-gray-400 text-white hover:bg-gray-700"
          >
            Login
          </button>
          <p className="text-black font-bold text-sm text-center">
            Not a User?{" "}
            <span>
              <Link href="/signup" className="text-blue-500">
                Sign Up
              </Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
