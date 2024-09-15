"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateUserSchema } from "../models/UserSchema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(CreateUserSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateUserSchema) => {
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
          return toast.error(result?.message || "Failed to Register New User.");
          // throw new Error("Failed to Register New User.");
        }
        toast.success(result?.message);
        return result;
      } catch (error) {}
    },
    onSuccess: () => {
      reset();
      router.push("/login");
    },
  });

  const onSubmit: SubmitHandler<CreateUserSchema> = (data) => {
    mutate(data);
  };
  return (
    <div className="min-h-screen p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-full max-w-lg mx-auto px-4 py-2 rounded space-y-3 mt-24"
      >
        <h2 className="text-3xl font-bold py-3 text-black text-center">
          {isPending ? "Processing..." : "Sign Up"}
        </h2>
        <div>
          <input
            {...register("name", { required: true })}
            className="text-sm rounded text-black px-4 py-2 w-full border shadow shadow-gray-400"
            type="text"
            placeholder="Name"
          />
          {errors?.name && (
            <p className="text-sm text-red-500">{errors?.name?.message}</p>
          )}
        </div>
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
        <div>
          <input
            {...register("cPassword", { required: true })}
            className="text-sm rounded text-black px-4 py-2 w-full border shadow shadow-gray-400"
            type="password"
            placeholder="Confirm Password"
          />
          {errors?.cPassword && (
            <p className="text-sm text-red-500">{errors?.cPassword?.message}</p>
          )}
        </div>
        <div className="space-y-3">
          <button
            type="submit"
            className="px-4 py-2 rounded text-sm w-full font-bold bg-gray-400 text-white hover:bg-gray-700"
          >
            Sign Up
          </button>
          <p className="text-black font-bold text-sm text-center">
            Already a User ?{" "}
            <span>
              <Link href="/login" className="text-blue-500">
                Login
              </Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
