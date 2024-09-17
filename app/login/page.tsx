/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { loginUserSchema } from "../models/UserSchema";
import { toast } from "@/hooks/use-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<loginUserSchema>({
    resolver: zodResolver(loginUserSchema),
  });
  const { mutate } = useMutation({
    mutationFn: async (data: loginUserSchema) => {
      const result = await signIn("credentials", {
        email: data?.email,
        password: data?.password,
      });

      if (result?.error) {
        throw new Error(result?.error);
      }
    },
    onSuccess: () => {
      reset();
      return toast({
        title: "Logged In",
      });
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit: SubmitHandler<loginUserSchema> = (data: loginUserSchema) => {
    mutate(data);
  };
  return (
    <div className="min-h-screen">
      <div className="mt-20 p-3">
        <h2 className="w-full py-3 max-w-md mx-auto text-4xl font-bold text-blue-500">
          Login
        </h2>
        <Card className="w-full max-w-md mx-auto p-6 border border-blue-500 shadow-md bg-white">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...register("email", { required: true })}
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors?.email && (
                <p className="text-sm font-bold text-red-500">
                  {errors?.email?.message}
                </p>
              )}
            </div>
            <div>
              <Input
                {...register("password", { required: true })}
                placeholder="Password"
                type="password"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors?.password && (
                <p className="text-sm font-bold text-red-500">
                  {errors?.password?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-4 mt-4">
              <Button
                variant={"secondary"}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md"
              >
                Login
              </Button>
              <p className="text-center text-sm text-gray-600">
                Don't have an account?
                <Link href="/signup" className="text-blue-600 font-bold ml-3">
                  Sign Up
                </Link>
              </p>
              <Button
                type="button"
                onClick={() => signIn("google")}
                variant={"secondary"}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-md"
              >
                Login with Google
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
