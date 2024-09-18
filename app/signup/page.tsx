"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signupUserSchema } from "../models/UserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<signupUserSchema>({
    resolver: zodResolver(signupUserSchema),
  });
  const onSubmit = async (data: signupUserSchema) => {
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
        throw new Error(result?.message || "Sign Up Failed");
      }
      reset();
      toast({
        title: "Success",
        description: result?.message || "Sign Up Success",
      });
      router.push("/login");
      return result;
    } catch (error) {
      const err = error as Error;
      console.log(`Something went wrong. Sign Up failed ${error}`);
      return toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Sign Up Failed",
      });
    }
  };
  return (
    <div className="min-h-screen">
      <div className="mt-20 p-3">
        <h2 className="max-w-md mx-auto text-3xl font-bold text-blue-600 py-3">
          Sign Up
        </h2>
        <Card className="max-w-md mx-auto p-4 border-2 border-blue-500">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...register("firstname", { required: true })}
                type="text"
                placeholder="First Name"
              />
              {errors?.firstname && (
                <p className="text-sm text-red-500">
                  {errors?.firstname?.message}
                </p>
              )}
            </div>
            <div>
              <Input
                {...register("lastname", { required: true })}
                type="text"
                placeholder="Last Name"
              />
              {errors?.lastname && (
                <p className="text-sm text-red-500">
                  {errors?.lastname?.message}
                </p>
              )}
            </div>
            <div>
              <Input
                {...register("email", { required: true })}
                type="email"
                placeholder="Email"
              />
              {errors?.email && (
                <p className="text-sm text-red-500">{errors?.email?.message}</p>
              )}
            </div>
            <div>
              <Input
                {...register("password", { required: true })}
                type="password"
                placeholder="Password"
              />
              {errors?.password && (
                <p className="text-sm text-red-500">
                  {errors?.password?.message}
                </p>
              )}
            </div>
            <div>
              <Input
                {...register("cPassword", { required: true })}
                type="password"
                placeholder="Confirm Password"
              />
              {errors?.cPassword && (
                <p className="text-sm text-red-500">
                  {errors?.cPassword?.message}
                </p>
              )}
            </div>
            <div>
              <Button
                variant={"secondary"}
                className="w-full bg-blue-500 hover:bg-blue-600 rounded text-white font-bold text-sm"
              >
                Sign Up
              </Button>
              <div className="flex flex-col space-y-3 mt-4 items-center justify-center">
                <p>
                  Already have an account ?{" "}
                  <Link href="/login" className="text-blue-600 font-bold ml-3">
                    Login
                  </Link>
                </p>
                <Button
                  variant={"secondary"}
                  className="bg-blue-700 hover:bg-blue-600 rounded text-white font-bold text-sm"
                >
                  Sign Up With Google
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
