"use client";

import Link from "next/link";
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
  const { status } = useSession();
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

  const LogoutButton = () => (
    <Button
      onClick={() => signOut()}
      className="lg:block"
      variant="destructive"
    >
      Logout
    </Button>
  );

  // Navbar
  return (
    <header className="bg-blue-500 shadow-md">
      <nav className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
            <Clipboard className="mr-2" />
            <span>Task Manager</span>
          </h2>
        </Link>

        {/* Desktop View */}
        <div className="hidden lg:flex items-center space-x-4 text-white">
          {isLoading ? (
            <LoadingIndicator />
          ) : isAuthenticated ? (
            <LogoutButton />
          ) : (
            <AuthButtons />
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" aria-label="Open menu">
              <AlignJustify color="white" />
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
                  {isAuthenticated ? <LogoutButton /> : <AuthButtons />}
                </div>
              )}
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
