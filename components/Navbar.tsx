/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlignJustify, Clipboard } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { status, data } = useSession();
  // console.log("d", data);
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  // Components for various states
  const LoadingIndicator = () => (
    <p className="text-sm font-black text-white">Loading...</p>
  );

  const AuthButtons = () => (
    <div className="flex items-center space-x-4">
      <Link href="/login">
        <Button variant="secondary">Login</Button>
      </Link>
      <Link href="/signup">
        <Button variant="outline" className="rounded">
          Sign Up
        </Button>
      </Link>
    </div>
  );

  const AvatarButton = () => (
    <>
      {/* <p>{String(data?.user?.firstname)}</p> */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <span>
            <Avatar>
              <AvatarImage
                src={String(data?.user?.image)}
                // @ts-ignore
                alt={String(data?.user?.firstname)}
              />
              <AvatarFallback className="text-black">
                {String(
                  // @ts-ignore
                  data?.user?.firstname[0] + String(data?.user?.lastname[0])
                )}
              </AvatarFallback>
            </Avatar>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              onClick={() => signOut()}
              variant={"destructive"}
              className="w-full"
            >
              Logout
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  // Navbar
  return (
    <header className="bg-blue-500 shadow-md">
      <nav className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
            <Clipboard className="mr-2" />
          </h2>
        </Link>

        {/* Desktop View */}
        <div className="hidden lg:flex items-center space-x-4 text-white">
          {isLoading ? (
            <LoadingIndicator />
          ) : isAuthenticated ? (
            <AvatarButton />
          ) : (
            <AuthButtons />
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant={"secondary"}>
              <AlignJustify />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-slate-600">
            <SheetHeader>
              <SheetTitle className="mb-10">
                {/* Mobile Logo */}
                <Link href="/" className="flex items-center">
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Clipboard className="mr-2" />
                    <span>Task Manager</span>
                  </h2>
                </Link>
              </SheetTitle>

              {/* Mobile View */}
              {isLoading ? (
                <LoadingIndicator />
              ) : (
                <div className="flex flex-col space-y-4 text-white">
                  {isAuthenticated ? (
                    <>
                      <Avatar>
                        <AvatarImage
                          src={String(data?.user?.image)}
                          // @ts-ignore
                          alt={String(data?.user?.firstname)}
                        />
                        <AvatarFallback className="text-black">
                          {String(
                            // @ts-ignore
                            data?.user?.firstname[0] +
                              // @ts-ignore
                              String(data?.user?.lastname[0])
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        onClick={() => signOut()}
                        variant={"destructive"}
                        className="w-full"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <AuthButtons />
                  )}
                </div>
              )}
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
