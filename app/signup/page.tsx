"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="min-h-screen">
      <div className="mt-20 p-3">
        <h2 className="max-w-md mx-auto text-3xl font-bold text-blue-600 py-3">
          Sign Up
        </h2>
        <Card className="max-w-md mx-auto p-4 border-2 border-blue-500">
          <form action="" className="space-y-4">
            <div>
              <Input placeholder="First Name" />
            </div>
            <div>
              <Input placeholder="Last Name" />
            </div>
            <div>
              <Input placeholder="Email" />
            </div>
            <div>
              <Input placeholder="Password" />
            </div>
            <div>
              <Input placeholder="Confirm Password" />
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
                  Already have an account ? <Link href="/login" className="text-blue-600 font-bold ml-3">Login</Link>
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
