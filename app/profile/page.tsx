/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useSession, signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data } = useSession();

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-50 p-4">
      <Card className="bg-white w-full max-w-lg mx-auto shadow-lg rounded-lg">
        <CardHeader className="flex flex-col items-center text-center p-6">
          {/* Avatar Section */}
          <Avatar className="w-24 h-24 border border-green-500 mb-4">
            <AvatarImage
              src={String(data?.user?.image)}
              // @ts-ignore
              alt={String(data?.user?.firstname) || "Profile Image"}
            />
            <AvatarFallback className="text-xl text-black bg-gray-300">
              {String(
                // @ts-ignore
                (data?.user?.firstname?.[0] || "") + (data?.user?.lastname?.[0] || "")
              )}
            </AvatarFallback>
          </Avatar>

          {/* User Information */}
          <CardTitle className="text-2xl font-semibold mt-2">
            {/* @ts-ignore */}
            {data?.user?.firstname} {data?.user?.lastname}
          </CardTitle>
          <CardDescription className="text-gray-500">
            {data?.user?.email}
          </CardDescription>
        </CardHeader>

        {/* User Details */}
        <div className="px-6 pb-6 space-y-4">
          <div>
            <Label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
              First Name
            </Label>
            <p className="text-lg text-gray-800">
              {/* @ts-ignore */}
              {data?.user?.firstname}
            </p>
          </div>
          <div>
            <Label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
              Last Name
            </Label>
            <p className="text-lg text-gray-800">
              {/* @ts-ignore */}
              {data?.user?.lastname}
            </p>
          </div>
        </div>

        {/* Card Footer */}
        <CardFooter className="flex justify-center p-6 border-t border-gray-200">
          <Button variant={"destructive"} onClick={() => signOut()}>
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
